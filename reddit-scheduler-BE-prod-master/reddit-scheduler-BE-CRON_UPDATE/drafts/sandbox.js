const app = require('../src/app');

const test = async () => {
  const userLoginInfo = { email: 'cyberloh2@mail.ru', password: 'myeasypass' };
  const { user, userAccessToken } = await app.service('authentication').create({
    strategy: 'local',
    ...userLoginInfo
  });
  const users = await app.service('users').find({ user, query: { isAdmin: true } });
  console.log(users);
};

test();
