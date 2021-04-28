const logger = require('../../logger');
const { getMyRedditAccountInfo, getRedditAccessToken } = require('../../reddit');

module.exports = {

  async all(params){
    return 'hello';
  },

  async find(params){
    if(!params.query.state || !params.query.code)
      return 'no state or code passed';
    try{
      const tokenInfo = await getRedditAccessToken(
        this.app.get('redditClientId'), 
        this.app.get('redditClientSecret'), 
        this.app.get('redditCallbackUri'),
        params.query.code);
      const myRedditInfo = await getMyRedditAccountInfo(this.app, tokenInfo.refresh_token);
      const account = await this.app.service('accounts')
        .patch(params.query.state, {
          username: myRedditInfo.name,
          iconImg: myRedditInfo.icon_img,
          accessToken: tokenInfo.access_token,
          refreshToken: tokenInfo.refresh_token
        });
      return account;
    }
    catch(err){
      logger.error(err);
      return err;
    }
    return 'ok';
  },

  async get(params){
    return 'hello';
  },
  
  setup(app, path) { 
    this.app = app;
  }

};
