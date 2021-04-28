
const { authenticate } = require('@feathersjs/authentication').hooks;
const common = require('feathers-hooks-common');
const accountService = require('./notifier');
const isAction = (...args) => hook => args.includes(hook.data.action);


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      common.iff(
        isAction('passwordChange', 'identityChange'),
        [ 
          authenticate('jwt'),
        ]
      ),    
    ],
    update: [],
    patch: [

    ],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
