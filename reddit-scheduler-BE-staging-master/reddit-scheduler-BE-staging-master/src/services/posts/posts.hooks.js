const { authenticate } = require('@feathersjs/authentication').hooks;
const { populate } = require('feathers-hooks-common');
const logger = require('../../logger');
const { setField } = require('feathers-authentication-hooks');
const { linkPostSubmit } = require('../../reddit');
const { addUser,
        aggregate,
        creationQuota,
        imageUpload,
        labelFilter,
        ownerOrAdmin, 
        populateField,
        postIfNow, 
        sortCreatedDesc } = require('../customHooks');

const fixSubredditName = context => {
  if(context.data.subreddit.startsWith('/r/'))
    return;
  context.data.subreddit = '/r/' + context.data.subreddit;
};

module.exports = {
  before: {
    all: [ 
      authenticate('jwt'), 
      ownerOrAdmin
    ],
    find: [ aggregate, sortCreatedDesc,  ],
    get: [],
    create: [ creationQuota, addUser, imageUpload, postIfNow],
    update: [],
    patch: [ imageUpload ],
    remove: []
  },

  after: {
    all: [],
    find: [
      populateField('user'),
      populateField('account'),
    ],
    get: [],
    create: [ populateField('account') ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
