const { authenticate } = require('@feathersjs/authentication').hooks;
const { ownerOrAdmin, distinctLabel } = require('../customHooks');
module.exports = {
  before: {
    all: [ authenticate('jwt'), ownerOrAdmin ],
    find: [ distinctLabel ]
  }
};
