const snoowrap = require('snoowrap');

const r = new snoowrap({
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
  clientId: 'nK0c4PYO1wegfA',
  clientSecret: 'LQKDsHeBfGdLJAZVplRK3pTwImc',
  refreshToken: '507731258829-8rpCVcoHMdOWo6BhqOyRpzde8Qs'
});

r.getMe().then(console.log);
