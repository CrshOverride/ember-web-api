import Ember from 'ember';
import DS from 'ember-data';
import { A } from '@ember/array';
import { copy } from '@ember/object/internals';

export default DS.RESTSerializer.extend({
  isNewSerializerAPI: true,

  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    // If the response is empty, return the appropriate JSON API response.
    // Unfortunately, this._super apparently doesn't support this condition properly.
    // Based on the documentation at: http://jsonapi.org/format/
    if(payload === null) { return { data: null }; }

    let payloadWithRoot = {},
        isCollection = payload.length > 0,
        key = isCollection ? Ember.Inflector.inflector.pluralize(primaryModelClass.modelName) : primaryModelClass.modelName;

    payloadWithRoot[key] = payload;

    if(isCollection) {
      payload.forEach((item) => {
        this._extractRelationships(store, payloadWithRoot, item, primaryModelClass);
        item.attributes = copy(item, true);
        if(item.type) {
          item.type = primaryModelClass.modelName;
        }
        delete item.attributes.id;
      });
    } else {
      this._extractRelationships(store, payloadWithRoot, payload, primaryModelClass);
      payload.attributes = copy(payload, true);
      if(payload.type) {
        payload.type = primaryModelClass.modelName;
      }
      delete payload.attributes.id;
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

  sideloadItem: function(store, payload, type, record) {
    if (!(record instanceof Object)) {
      return false;
    }

    let key = Ember.Inflector.inflector.pluralize(type.modelName),
        arr = payload[key] || A([]),
        pk = store.serializerFor(type.modelName).primaryKey,
        id = record[pk];

    if(typeof arr.findBy(pk, id) !== 'undefined') {
      return true;
    }

    record.attributes = copy(record, true);
    record.type = type.modelName;
    delete record.attributes.id;

    arr.push(record);
    payload[key] = arr;
    return true;
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
});
