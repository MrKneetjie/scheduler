// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const crypto = require('crypto')
module.exports = function (app) {
  const modelName = 'users';
  const mongooseClient = app.get('mongooseClient');
  const opt = { toJSON: { virtuals: true }, toObject: { virtuals: true } };
  const schema = new mongooseClient.Schema({
  
    email: { type: String, required: true, unique: true, lowercase: true },

    firstName: { type: String, required: true },

    lastName: { type: String, required: true },

    password: { type: String, required: true },

    accountsQuota: { type: Number, default: 0 },

    postsQuota: { type: Number, default: 0 },

    quotaExpiresAt: { type: Date, default: new Date() },

    roles: { type: Array, default: [] },

    //isAdmin: { type: Boolean, default: false },
  
    auth0Id: { type: String },
  
    googleId: { type: String },
  
    facebookId: { type: String },
  
    twitterId: { type: String },
  
    githubId: { type: String },
    isVerified: { type: Boolean },
    verifyToken: { type: String },
    verifyExpires: { type: Date },
    verifyChanges: { type: Object },
    resetToken: { type: String  },
    resetShortToken: { type: String },
    resetExpires: { type: Date }, // or a long integer
  
  }, {
    timestamps: true,
  });

  schema.virtual('isAdmin').get(function(){
    return this.roles.length > 0;
  });

  schema.set("toJSON", { virtuals: true });
  schema.set("toObject", { virtuals: true });
  
  
  
  schema.plugin(mongooseLeanVirtuals);
  
  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
