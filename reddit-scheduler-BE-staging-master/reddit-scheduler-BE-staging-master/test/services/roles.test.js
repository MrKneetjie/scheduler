const assert = require('assert');
const app = require('../../src/app');

describe('\'roles\' service', () => {
  it('registered the service', () => {
    const service = app.service('roles');

    assert.ok(service, 'Registered the service');
  });

  it('admin can access all', async () => {
    const adminLoginInfo = { email: 'cyberloh2@mail.ru', password: 'myeasypass' };
    const { admin, adminAcessToken } = await app.service('authentication').create({
      strategy: 'local',
      ...adminLoginInfo
    });
    const userLoginInfo = { email: 'alliswave@mail.ru', password: 'myeasypass' };
    const { user, userAccessToken } = await app.service('authentication').create({
      strategy: 'local',
      ...userLoginInfo
    });
    const accounts = await app.service('accounts').find({ user });
    assert.equal(accounts.length, 0);
    const adminAccounts = await app.service('accounts').find({ user: admin });
    assert.ok(adminAccounts.length > 0);
  });

});
