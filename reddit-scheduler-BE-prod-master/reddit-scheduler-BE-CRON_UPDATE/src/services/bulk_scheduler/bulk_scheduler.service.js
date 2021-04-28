// Initializes the `posts` service on path `/posts`
const { BulkScheduler } = require('./bulk_scheduler.class');
const createModel = require('../../models/bulk_scheduler.model');
const hooks = require('./bulk_scheduler.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app)
  };

  // Initialize our service with any options it requires
  app.use('/bulk-scheduler', new BulkScheduler(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('bulk-scheduler');

  service.hooks(hooks);
};
