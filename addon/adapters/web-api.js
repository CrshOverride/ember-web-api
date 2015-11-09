import Ember from 'ember';
import DS from 'ember-data';

const VALIDATION_ERROR_STATUSES = [400, 422];

export default DS.RESTAdapter.extend({
  namespace: 'api',

  isInvalid: function(status) {
    return VALIDATION_ERROR_STATUSES.indexOf(status) >= 0;
  },

  parseErrorResponse: function(responseText) {
    let json = this._super(responseText),
        strippedErrors = {},
        jsonIsObject = json && (typeof json === 'object');

    if (jsonIsObject && json.message) {
      delete json.message;
    }

    if (jsonIsObject && json.modelState) {
      Object.keys(json.modelState).forEach(key => {
        let newKey = key.substring(key.indexOf('.') + 1).camelize();
        strippedErrors[newKey] = json.modelState[key];
      });

      json.errors = this._errorsHashToArray(strippedErrors);

      delete json.modelState;
    }

    return json;
  },

  _errorsHashToArray: function (errors) {
    let out = [];

    if (Ember.isPresent(errors)) {
      Object.keys(errors).forEach(function(key) {
        let messages = Ember.makeArray(errors[key]);
        for (let i = 0; i < messages.length; i++) {
          out.push({
            title: 'Invalid Attribute',
            detail: messages[i],
            source: {
              pointer: `/data/attributes/${key}`
            }
          });
        }
      });
    }

    return out;
  }
});
