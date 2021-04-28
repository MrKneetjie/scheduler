const users = require('./users/users.service.js');
const accounts = require('./accounts/accounts.service.js');
const posts = require('./posts/posts.service.js');
const labels = require('./labels/labels.service.js');
const accounts_oauth = require('./accounts/accounts_oauth.service.js');
const oauth_callback = require('./accounts/oauth_callback.service.js');
const authmanagement = require('./authmanagement/authmanagement.service.js');
const mailer = require('./mailer/mailer.service.js')


const roles = require('./roles/roles.service.js');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {

  app.use('/oauth_callback', oauth_callback, (req, res, next) => {
    if(res.data)
      res.redirect(app.get('frontendUri') + '/accounts');
    app.configure(roles);
  });

  app.use('/accounts_oauth', accounts_oauth, (req, res, next) => {
    if(res.data)
      res.redirect(res.data);
    app.configure(roles);
  });
  app.configure(users);
  app.configure(accounts);
  app.configure(posts);
  app.configure(labels);
  app.configure(roles);
  app.configure(authmanagement);
  app.configure(mailer);
};
