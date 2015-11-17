import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:web-api', 'Unit | Adapter | web api', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let error = {
        message: 'An error has occurred',
        modelState: {
            'droid.Name': 'This name has already been taken'
        }
      },
      adapter = this.subject(),
      parsed = adapter.parseErrorResponse(JSON.stringify(error)),
      expected = {
        errors: [{
          detail: 'This name has already been taken',
          source: {
            pointer: '/data/attributes/name'
          },
          title: 'Invalid Attribute'
        }]
      };

  assert.deepEqual(parsed, expected);
});
