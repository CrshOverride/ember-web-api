import DS from 'ember-data';

const VALIDATION_ERROR_STATUSES = [400, 422];

export default DS.RESTAdapter.extend({
  namespace: 'api',

  ajaxError: function(xhr, response) {
    let error = this._super(xhr);
    
    if(!error || VALIDATION_ERROR_STATUSES.indexOf(error.status) < 0) {
      return error;
    }
    
    return new DS.InvalidError(JSON.parse(response));
  }
});
