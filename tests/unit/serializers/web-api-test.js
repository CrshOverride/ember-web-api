import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:web-api', 'Unit | Serializer | web api', {
  // Specify the other units that are required for this test.
  needs: [
    'model:droid',
    'model:humanoid'
  ],
  setup: function() {
    this.store = this.container.lookup('service:store');
  }
});

// Replace this with your real tests.
test('it parses a simple record', function(assert) {
  let serializer = this.subject(),
      type = this.store.modelFor('droid'),
      response = {
        id: 1,
        type: 'protocol',
        model: 'C3PO'
      },
      parsed = serializer.normalizeResponse(this.store, type, response, 1, 'findRecord'),
      expected = {
        data: {
          type: 'droid',
          id: '1',
          attributes: {
            type: 'protocol',
            model: 'C3PO'
          },
          relationships: {}
        },
        included: []
      };

  assert.deepEqual(expected, parsed);
});

test('it parses a basic hasMany relationship', function(assert) {
  let serializer = this.subject(),
      type = this.store.modelFor('humanoid'),
      response = {
        id: 1,
        name: 'Luke Skywalker',
        isJedi: true,
        droids: Ember.A([
          { id: 1, type: 'protocol', model: 'C3PO' },
          { id: 2, type: 'astromech', model: 'R2D2' }
        ])
      },
      parsed = serializer.normalizeResponse(this.store, type, response, 1, 'findRecord'),
      expected = {
        data: {
          type: 'humanoid',
          id: '1',
          attributes: {
            name: 'Luke Skywalker',
            isJedi: true
          },
          relationships: {
          droids: {
              data: [{
                id: '1',
                type: 'droid'
              }, {
                id: '2',
                type: 'droid'
              }]
            }
          }
        },
        included: [{
          id: '1',
          type: 'droid',
          attributes: {
            type: 'protocol',
            model: 'C3PO'
          },
          relationships: {}
        }, {
          id: '2',
          type: 'droid',
          attributes: {
            type: 'astromech',
            model: 'R2D2'
          },
          relationships: {}
        }]
      };

  assert.deepEqual(expected, parsed);
});

test('it handles an empty response properly', function(assert) {
  let serializer = this.subject(),
      type = this.store.modelFor('droid'),
      response = null,
      parsed = serializer.normalizeResponse(this.store, type, response, 1, 'findBelongsTo'),
      expected = { data: null };

  assert.deepEqual(expected, parsed);
});
