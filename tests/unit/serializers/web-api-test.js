import { moduleForModel, test } from 'ember-qunit';

moduleForModel('web-api', 'Unit | Serializer | web api', {
  // Specify the other units that are required for this test.
  needs: ['serializer:web-api']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  var record = this.subject();

  var serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
