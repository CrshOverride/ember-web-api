import DS from 'ember-data';

const VALIDATION_ERROR_STATUSES = [400, 422];

export default DS.RESTAdapter.extend({
  namespace: 'api',

  isInvalid: function(status) {
    return VALIDATION_ERROR_STATUSES.indexOf(status) >= 0;
  },

  // Override the parseErrorResponse method from RESTAdapter
  // so that we can munge the modelState into an errors collection.
  // The source of the original method can be found at:
  // https://github.com/emberjs/data/blob/v2.1.0/packages/ember-data/lib/adapters/rest-adapter.js#L899
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

      json.errors = strippedErrors;

      delete json.modelState;
    }

    return json;
  }
});
