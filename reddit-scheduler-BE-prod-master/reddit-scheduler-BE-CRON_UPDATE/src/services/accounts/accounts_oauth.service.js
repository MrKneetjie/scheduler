const querystring = require('querystring');

module.exports = {

  async find(params){
    if(!params.query.account)
      return;
    const auth_url = 'https://www.reddit.com/api/v1/authorize?';
    const query = {
      client_id: this.app.get('redditClientId'),
      response_type: 'code',
      redirect_uri: this.app.get('redditCallbackUri'),
      state: params.query.account,
      duration: 'permanent',
      scope: 'account edit history identity mysubreddits privatemessages read report save submit vote'
    };
    return auth_url + querystring.encode(query);
  },
  
  setup(app, path) { 
    this.app = app;
  }

};
