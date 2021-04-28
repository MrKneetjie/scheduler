const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');
const axios = require('axios');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');

const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');
const XMLHttpRequest = require('xhr2')


const authentication = require('./authentication');
const mongoose = require('./mongoose');
const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(compress());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));


// Host the public folder
app.use('/', express.static(app.get('public')));


// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(mongoose);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);

// adding res for redirects
app.use((req, res,  next) => {
  req.feathers.res = res;
  next();
});
app.get('/verify', function (req, res) {

    console.log(req.query.token)
    var obj = {
      action: 'verifySignupLong',
      value: req.query.token
    }

    const headers = {
      'Content-Type': 'application/json'
    }

    axios.post('https://onlybands.xyz/reddit_api/authManagement', JSON.stringify(obj), {
      headers: headers
    })
    .then((response) => {
      res.redirect(`https://onlybands.xyz/scheduler/verify?verified=true`);
    })
    .catch((error) => {
      console.log(error)
      res.redirect(`https://onlybands.xyz/scheduler/verify?verified=false`);
    })
 
  //res.redirect(`https://onlybands.xyz/scheduler/verify?token=${req.query.token}`);
})
app.get('/reset', function (req, res) {
  console.log(req.query.token)
  res.redirect(`https://onlybands.xyz/scheduler/reset?token=${req.query.token}`);
})


// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);


module.exports = app;
