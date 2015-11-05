import DS from 'ember-data';
import Ember from 'ember';

const VALIDATION_ERROR_STATUSES = [400, 422];

export default DS.RESTAdapter.extend({
  namespace: 'api',

  isInvalid: function(status, headers, payload) {
    return VALIDATION_ERROR_STATUSES.indexOf(status) >= 0;
  }
});
