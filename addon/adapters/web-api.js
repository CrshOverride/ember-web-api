import DS from 'ember-data';
import Ember from 'ember';

const VALIDATION_ERROR_STATUSES = [400, 422];

export default DS.RESTAdapter.extend({
  namespace: 'api',

  isInvalid: function(status, headers, payload) {
    if (VALIDATION_ERROR_STATUSES.indexOf(status) >= 0) {
      // handleResponse expects the erros in the errors property
      payload.errors = this.errorsHashToArray(payload.modelState);
      return true;
    }
    return false;
  },

  errorsHashToArray: function (errors) {
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
