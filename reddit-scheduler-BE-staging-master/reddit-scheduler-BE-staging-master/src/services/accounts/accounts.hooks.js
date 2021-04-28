const { authenticate } = require('@feathersjs/authentication').hooks;
const { populate } = require('feathers-hooks-common');
const { setField } = require('feathers-authentication-hooks');
const { aggregate,
        addUser,
        creationQuota,
        isAdmin, 
        populateField,
        ownerOrAdmin } = require('../customHooks');

module.exports = {
  before: {

    all: [ 
      authenticate('jwt'), 
      ownerOrAdmin,
    ],

    find: [ aggregate ],
    get: [],
    create: [ addUser, creationQuota ],    
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    //all: [populate({
    //        schema: {
    //            include: [{
    //                service: 'users',
    //                nameAs: 'user',
    //                parentField: 'user',
    //                childField: '_id'
    //            }]
    //        }
    //    })],
    find: [ populateField('user') ],
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
