const assert = require('assert');
const app = require('../../src/app');

describe('\'accounts\' service', () => {
  it('registered the service', () => {
    const service = app.service('accounts');

    assert.ok(service, 'Registered the service');
  });
  it('finds accounts', async () => {
    const accounts = await app.service('accounts').find({});
    assert.ok(accounts.length > 0, 'Db has accounts stored');
  });
});
