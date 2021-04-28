import feathersClient, { makeServicePlugin, BaseModel } from '@/plugins/feathers'

class Label extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Label';
  // Define default properties here
  static instanceDefaults() {
    return {
      label: ''
    } 
  };
};

const servicePath = 'labels';
const servicePlugin = makeServicePlugin({
  Model: Label,
  service: feathersClient.service(servicePath),
  servicePath,
  paginate: false 
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
});

export default servicePlugin;
