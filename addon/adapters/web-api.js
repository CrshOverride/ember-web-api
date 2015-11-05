import DS from 'ember-data';

const VALIDATION_ERROR_STATUSES = [400, 422];

export default DS.RESTAdapter.extend({
  namespace: 'api',

  isInvalid: function(status) {
    return VALIDATION_ERROR_STATUSES.indexOf(status) >= 0;
  }
});
