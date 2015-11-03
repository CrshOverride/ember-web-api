import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  isJedi: DS.attr('boolean'),
  droids: DS.hasMany('droid')
});
