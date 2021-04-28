const crypto = require('crypto');
const { setField } = require('feathers-authentication-hooks');
const errors = require('feathers-errors');
const { linkPostSubmit } = require('../reddit');

const { populate, preventChanges } = require('feathers-hooks-common');
const mongoose = require('mongoose');
const { uploadBase64 } = require('../unirest_imgur');
const logger = require('../logger');
const mailer = require('nodemailer')

const isAdmin = context => {
  const addAdminField = user => {
    user.isAdmin = (user.roles && user.roles.includes('admin'));
    return user;
  }
  if(Array.isArray(context.result))
    context.result = context.result.map(addAdminField);
  else
    context.result = addAdminField(context.result);
};


const isExist = context => {

    let emailExist = context.app.service('users').find({email:context.params.email})
    return emailExist
}

const ownerOrAdmin = context => {
  if(context.params.user && context.params.user.isAdmin === false)
    setField({
      from: 'params.user._id',
      as: context.path === 'users' ? 'params.query._id' : 'params.query.user'
    })(context);
};

const distinctLabel = async context => {
  context.result = await context.service.Model.find(context.params.query).distinct('label');
  context.result = context.result.map((label, index) => ({ _id: index.toString(), text: label }));
};

const countForUser = async (service, userId, fieldName) => {
  const result = await service.Model.aggregate([
  {
    $match: { 
      user: mongoose.Types.ObjectId(userId)
    }
  }, 
  {
    $count: fieldName
  }]);
  if(result && result.length > 0)
    return result[0];
  return { [ fieldName ]: 0 };
};

const userQuotasUsage = async context => {
  const users = !Array.isArray(context.result) ? [context.result] : context.result;
  for(let user of users){
    const { accountsAdded } = await countForUser(context.app.service('accounts'), user.id, 'accountsAdded');
    const { postsAdded } = await countForUser(context.app.service('posts'), user.id, 'postsAdded');
    user.accountsAdded = accountsAdded;
    user.postsAdded = postsAdded;
  }
};

const aggregate = context => {
  if(context.params.query && '$aggregate' in context.params.query)
    context.result = context.service.Model.aggregate(context.params.query.$aggregate);
};

const labelFilter = context => {
  if('$at' in context.params.query)
    console.log('we got at query')
}

//const ownerOrAdmin = context => {
//  if(context.params.user && context.params.user.isAdmin === false) {
//    console.log('limiting users for. isAdmin: ' + context.params.user.isAdmin );
//    const setFieldParams = {};
//    if(context.path === 'users'){
//      setFieldParams.from = 'params.user.email',
//      setFieldParams.as = 'params.query.email'
//    }
//    else {
//      setFieldParams.from = 'params.user._id';
//      setFieldParams.as = 'params.query.user';
//    }
//    setField(setFieldParams)(context);
//  }
//  else {
//    if(context.params.user){
//      console.log('current user is: ' + context.params.user.email);
//      console.log(context.result);
//    }
//  }
//};

const preventQuotasPatch = context => {
  if(!context.params.user.isAdmin)
    preventChanges(true, 'accountsQuota', 'postsQuota', 'quotaExpiresAt')(context);
};

const postIfNow = async context => {
  try {
    if(context.data.timeSetting !== 'now')
      return;
    context.data.account = await context.app.service('accounts').get(context.data.account);
    const { updates } = await linkPostSubmit(context.app, context.data);
    context.data = {
      ...context.data, 
      ...updates
    };
  }
  catch(err){
    console.log(err);
  }
};

const sortCreatedDesc = context => {
  if(!context.params.query)
    return;
  if(!context.params.query.$sort)
    context.params.query.$sort = {
      createdAt: -1
    };
};

const populateField = (fieldName, asArray = false, query = {}) => {
  const service = fieldName.endsWith('s') ? fieldName : fieldName + 's';
  return populate({ 
    schema: {
      include: {
        service,
        nameAs: fieldName,
        parentField: fieldName,
        childField: '_id',
        asArray,
        query
      }
    }});
};

const addUser =  context => {
  context.data.user = context.params.user;
};

const mapRoleNames = context => {
  context.result = context.result.map(role => role.name);
};

const creationQuota = context => {
  const { accountsQuota, postsQuota, postsAdded, accountsAdded, 
    quotaExpiresAt } = context.params.user;
  if(new Date() > quotaExpiresAt)
    throw new errors.BadRequest('Account activation expired');
  if(context.path === 'posts' && (postsAdded >= postsQuota)) 
    throw new errors.BadRequest('Posts quota exceeded');
  if(context.path === 'accounts' && (accountsAdded >= accountsQuota))
    throw new errors.BadRequest('Accounts quota exceeded');
};

const imageUpload = async context => {
  if(!context.data.img)
    return;
  const newMd5Hash = crypto.createHash('md5').update(context.data.img).digest("hex");
  if(context.data.md5hash && context.data.md5hash === newMd5Hash)
    return;
  console.log('new hash. uploading');
  return uploadBase64(context.data.img.replace(/^data:image\/[a-z]+;base64,/, ''))
    .then(imageUrl => {
      console.log(imageUrl);
      context.data.imageUrl = imageUrl;
      context.data.md5hash = newMd5Hash;
      console.log(context.data);
    })
    .catch(err => {
      logger.error('image upload error');
      context.data.error = err;
    });
};

module.exports = {
  aggregate,
  addUser,
  creationQuota,
  distinctLabel,
  imageUpload,
  isAdmin,
  labelFilter,
  mapRoleNames,
  ownerOrAdmin,
  populateField,
  postIfNow,
  sortCreatedDesc,
  preventQuotasPatch,
  userQuotasUsage,
  isExist

};
