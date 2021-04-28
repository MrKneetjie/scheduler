const { Posts } = require('../posts/posts.class');
const createModel = require('../../models/posts.model');
const hooks = require('./labels.hooks');

module.exports = function (app) {
  const { Model } = app.service('/posts');

  const options = {
    Model, //createModel(app),
    paginate: false
  };

  app.use('/labels', new Posts(options, app));
  const service = app.service('labels');
  service.hooks(hooks);
};
