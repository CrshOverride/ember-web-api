import Ember from 'ember';
import DS from 'ember-data';
import { pluralize } from 'ember-inflector';

export default DS.RESTSerializer.extend({
  isNewSerializerAPI: true,
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    let payloadWithRoot = {},
        isCollection = payload.length > 0,
        key = isCollection ? pluralize(primaryModelClass.modelName) : primaryModelClass.modelName;

    payloadWithRoot[key] = payload;

    if(isCollection) {
      payload.forEach((item) => {
        this._extractRelationships(store, payloadWithRoot, item, primaryModelClass);
      });
    } else {
      this._extractRelationships(store, payloadWithRoot, payload, primaryModelClass);
    }

    return this._super(store, primaryModelClass, payloadWithRoot, id, requestType);
  },

  serializeHasMany: function(snapshot, json, relationship) {
    let key = this.payloadKeyFromModelName(relationship.key);
    if (this._shouldSerializeHasMany(snapshot, key, relationship)) {
      json[key] = [];

      snapshot.hasMany(relationship.key).forEach((i) => {
        json[key].push(this.serialize(i, { includeId: true }));
      });
    }
  },

  serializeIntoHash: function(json, typeClass, snapshot, options) {
    if(!options) {
      options = { includeId: true };
    } else {
      options.includeId = true;
    }

    var serialized = this.serialize(snapshot, options),
        prop;

    for(prop in serialized) {
      if(serialized.hasOwnProperty(prop)) {
        json[prop] = serialized[prop];
      }
    }
  },

  extractErrors: function (store, typeClass, payload, id) {
    if (payload && typeof payload === 'object' && payload.errors) {
      this.clearModelName(payload.errors, typeClass.modelName);
    }

    return this._super(store, typeClass, payload, id);
  },

  clearModelName: function(errors, modelName) {
    // Since the new JSON API InvalidError structure appeared we need to handle it.
    // I know it sucks but for now the extractErrors hook gets the data pre-coocked into
    // JSON API errors :\
    errors.forEach(function(error) {
      var pointer = error.source.pointer;
      let lastIndex =  error.source.pointer.lastIndexOf('/') + 1;
      pointer = pointer.replace('/data/attributes/' + modelName, '/data/attributes/');
      pointer = pointer.slice(0, lastIndex) + pointer.slice(lastIndex).camelize();
      error.source.pointer = pointer;
    });
  },

  _extractRelationships: function(store, payload, record, type) {
    type.eachRelationship((key, relationship) => {
      let relatedRecord = record[key];

      if(relatedRecord) {
        let relationshipType = typeof relationship.type === 'string' ? store.modelFor(relationship.type) : relationship.type;
        if(relationship.kind === 'belongsTo') {
          this.sideloadItem(store, payload, relationshipType, relatedRecord);
          record[key] = relatedRecord[store.serializerFor(relationshipType.modelName).primaryKey];
          this._extractRelationships(store, payload, relatedRecord, relationshipType);
        } else if (relationship.kind === 'hasMany') {
          relatedRecord.forEach((item, index) => {
            if (this.sideloadItem(store, payload, relationshipType, item)) {
            relatedRecord[index] = item[store.serializerFor(relationshipType.modelName).primaryKey];
            }
            this._extractRelationships(store, payload, item, relationshipType);
          });
        }
      }
    });
  },

  sideloadItem: function(store, payload, type, record) {
    if (!(record instanceof Object)) {
      return false;
    }

    let key = pluralize(type.modelName),
        arr = payload[key] || Ember.A([]),
        pk = store.serializerFor(type.modelName).primaryKey,
        id = record[pk];

    if(typeof arr.findBy(pk, id) !== 'undefined') {
      return true;
    }

    arr.push(record);
    payload[key] = arr;
    return true;
  }
});
