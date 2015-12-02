import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:web-api', 'Unit | Adapter | web api', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

test('it is invlaid when the status is either 400 or 422 but valid otherwise', function(assert) {
  let adapter = this.subject();

  assert.ok(adapter.isInvalid(400), '400 should not be valid');
  assert.ok(adapter.isInvalid(422), '422 should not be valid');
  assert.notOk(adapter.isInvalid(200), '200 should be valid');
  assert.notOk(adapter.isInvalid(301), '301 should be valid');
});

test('it parses errors properly', function(assert) {
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
