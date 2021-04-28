import feathersClient, { makeServicePlugin, BaseModel } from '@/plugins/feathers'

class Account extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Account';
  // Define default properties here
  static instanceDefaults() {
    return {
      username: '',
      iconImg: '',
      accessToken: '',
      refreshToken: ''
      //permissions: []
    }
  };
};

const servicePath = 'accounts';
const servicePlugin = makeServicePlugin({
  Model: Account,
  service: feathersClient.service(servicePath),
  servicePath
});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [
      context => {
        if(context.result && context.result._id)
          window.location.replace(`${process.env.API_URL}/accounts_oauth?account=${context.result._id}`, '_blank');
      }
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
});

export default servicePlugin;
