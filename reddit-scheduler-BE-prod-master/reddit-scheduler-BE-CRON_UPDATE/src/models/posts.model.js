// posts-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'posts';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    label: { type: String },
    title: { type: String },
    body: { type: String},
    imageUrl: { type: String },
    md5hash: { type: String },
    subreddit: { type: String },
    postAt: { type: Date },
    timeSetting: { type: String },
    timeShiftUnits: { type: String },
    timeShiftPeriod: { type: Number },
    submissionName: { type: String },
    error: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'Users' },
    account: { type: Schema.Types.ObjectId, ref: 'Accounts' },
    posted: { type: Boolean, default: false }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
  
};
