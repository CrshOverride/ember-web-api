import DS from 'ember-data';

const VALIDATION_ERROR_STATUSES = [400, 422];

export default DS.RESTAdapter.extend({
  namespace: 'api',

  isInvalid: function(status, headers, payload) {
    if (VALIDATION_ERROR_STATUSES.indexOf(status) >= 0) {
      // handleResponse expects the erros in the errors property
      payload.errors = payload.modelState;
      return true;
    }
    return false;
  }
});
