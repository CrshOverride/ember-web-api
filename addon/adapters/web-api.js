import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  namespace: 'api',

  ajaxError: function(_, response) {
    return new DS.InvalidError(JSON.parse(response));
  }
});
