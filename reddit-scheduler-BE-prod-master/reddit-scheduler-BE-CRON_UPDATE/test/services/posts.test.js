const assert = require('assert');
const app = require('../../src/app');

describe('\'posts\' service', () => {
  it('registered the service', () => {
    const service = app.service('posts');

    assert.ok(service, 'Registered the service');
  });

  it('tests account population', async () => {
    const posts = await app.service('posts').find({});
    assert.ok(posts[0].account.username === 'cyberloh');
  })
});
