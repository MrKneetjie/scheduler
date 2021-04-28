const assert = require('assert');
const app = require('../../src/app');

describe('\'users\' service', () => {
  it('registered the service', () => {
    const service = app.service('users');

    assert.ok(service, 'Registered the service');
  });

  it('finds users', async () => {
    const users = await app.service('users').find({});
    console.log(users[1].roles);
    assert.ok(users.length > 0);
  });

  it('checks user roles population', async () => {
    const service = app.service('users');
    const user = await service.get('5fa3c8b73672a7ffd6dacadc');
    assert.deepEqual(user.roles, ['admin']);
    assert.ok(user.isAdmin, 'user is admin');
  });

  it('prevents quotas patch for regular users', async () => {
    const patchFnUser = async () => {
      const { user, adminAccessToken } = await app.service('authentication').create({
        strategy: 'local',
        email: 'alliswave@mail.ru',
        password: 'myeasypass'
      });
      const patchedUser = await app.service('users').patch('5faaa3873191e8adcebd73cf', {
        postsQuota: 1
      }, { user });
    };
    const patchFnAdmin = async () => {
      const { admin, adminAccessToken } = await app.service('authentication').create({
        strategy: 'local',
        email: 'cyberloh2@mail.ru',
        password: 'myeasypass'
      });
      const patchedUser = await app.service('users').patch('5faaa3873191e8adcebd73cf', {
        postsQuota: 2
      }, { user: admin});
    };
    assert.rejects(patchFnUser);
    assert.doesNotReject(patchFnAdmin)
  });
});
