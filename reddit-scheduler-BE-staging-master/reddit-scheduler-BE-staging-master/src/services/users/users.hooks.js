const { authenticate } = require('@feathersjs/authentication').hooks;
const verifyHooks = require('feathers-authentication-management').hooks;
const commonHooks = require('feathers-hooks-common');
const accountService = require('../authmanagement/notifier');

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;
const { isAdmin, 
        ownerOrAdmin,
        populateField, 
        preventQuotasPatch,
        userQuotasUsage } = require('../customHooks');

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt'), ownerOrAdmin ],
    get: [ authenticate('jwt') ],
    create: [ hashPassword('password'),verifyHooks.addVerification() ],
    update: [  commonHooks.disallow('external') ],
    patch: [  authenticate('jwt')],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
      //populate('roles', { service: 'roles', field: 'user' })
    ],
    find: [ userQuotasUsage ],
    get: [ userQuotasUsage ],
    create: [
      context => {
        accountService(context.app).notifier('resendVerifySignup', context.result)
      },
      verifyHooks.removeVerification()
    ],
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
