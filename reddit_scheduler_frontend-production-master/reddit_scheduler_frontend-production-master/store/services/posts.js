import feathersClient, { makeServicePlugin, BaseModel } from '@/plugins/feathers'

class Post extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Post';
  // Define default properties here
  static instanceDefaults() {
    return {
      label: '',
      account: '',
      title: '',
      body: '',
      imageUrl: '',
      md5hash: '',
      subreddit: '',
      timeSetting: 'now',
      timeShiftUnits: 'minutes',
      timeShiftPeriod: 30,
      postAt: new Date().toISOString(),
      posted: false,
      submissionName: '',
      error: '',
      //permissions: []
    }
  };
};

const servicePath = 'posts';
const servicePlugin = makeServicePlugin({
  Model: Post,
  service: feathersClient.service(servicePath),
  servicePath,
  paginate: true
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
