var express = require('express');
var alexa = require('alexa-app');

var PORT = process.env.PORT || 12115;
var app = express();

// You choose here what will be the endpoint for Alexa. If empty it will be the root: '/'
var alexaApp = new alexa.app();
alexaApp.express({
    expressApp: app,
    //router: express.Router(),

    // verifies requests come from amazon alexa. Must be enabled for production.
    // You can disable this if you're running a dev environment and want to POST
    // things to test behavior. enabled by default.
    checkCert: true,

    // sets up a GET route when set to true. This is handy for testing in
    // development, but not recommended for production. disabled by default
    debug: false
});

var alexa = require('./index.js').handler(alexaApp);

app.listen(PORT, () => console.log('Listening on port ' + PORT + '.'));