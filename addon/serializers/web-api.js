import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  extract: function(store, primaryType, payload, id, requestType) {
    let payloadWithRoot = {},
        isCollection = payload.length > 0,
        key = isCollection ? primaryType.modelName.pluralize() : primaryType.modelName;

    payloadWithRoot[key] = payload;

    if(isCollection) {
      payload.forEach((item) => {
        this.extractRelationships(store, payloadWithRoot, item, primaryType);
      });
    } else {
      this.extractRelationships(store, payloadWithRoot, payload, primaryType);
    }

    return this._super(store, primaryType, payloadWithRoot, id, requestType);
  },

  serializeHasMany: function(snapshot, json, relationship) {
    let key = this.payloadKeyFromModelName(relationship.key);
    json[key] = [];

    snapshot.get(relationship.key).forEach((i) => {
      json[key].push(this.serialize(i, { includeId: true }));
    });
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

  extractErrors: function extractErrors(store, typeClass, payload, id) {
      let payloadKey = typeClass.modelName + '.';
      this.clearModelName(payload.errors, payloadKey)
      return this._super(store, typeClass,payload, id);
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

  extractRelationships: function(store, payload, record, type) {
    type.eachRelationship((key, relationship) => {
      let relatedRecord = record[key];

      if(relatedRecord) {
        let relationshipType = typeof relationship.type === 'string' ? store.modelFor(relationship.type) : relationship.type;
        if(relationship.kind === 'belongsTo') {
          this.sideloadItem(store, payload, relationshipType, relatedRecord);
          record[key] = relatedRecord[store.serializerFor(relationshipType.modelName).primaryKey];
          this.extractRelationships(store, payload, relatedRecord, relationshipType);
        } else if (relationship.kind === 'hasMany') {
          relatedRecord.forEach((item, index) => {
            this.sideloadItem(store, payload, relationshipType, item);
            relatedRecord[index] = item[store.serializerFor(relationshipType.modelName).primaryKey];
            this.extractRelationships(store, payload, item, relationshipType);
          });
        }
      }
    });
  },

  sideloadItem: function(store, payload, type, record) {
    // In case the returned data is just a number and not an actual object ignore
    if (!(record instanceof Object)) {
      return;
    }

    let key = type.modelName.pluralize(),
        arr = payload[key] || [],
        pk = store.serializerFor(type.modelName).primaryKey,
        id = record[pk];

    if(typeof arr.findBy(pk, id) !== 'undefined') {
      return;
    }

    arr.push(record);
    payload[key] = arr;
  }
});
