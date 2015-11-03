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
      hash = {
        type: 'protocol',
        model: 'C3PO'
      },
      parsed = serializer.extract(this.store, type, hash, null, 'find');

  assert.deepEqual(hash, parsed);
});

test('it parses a basic hasMany relationship', function(assert) {
  let serializer = this.subject(),
      type = this.store.modelFor('humanoid'),
      hash = {
        name: 'Luke Skywalker',
        isJedi: true,
        droids: [
          { type: 'protocol', model: 'C3PO' },
          { type: 'astromech', model: 'R2D2' }
        ]
      };

  let parsed = serializer.extract(this.store, type, hash, null, 'find');

  assert.ok(true);
});
