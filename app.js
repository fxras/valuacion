/*eslint-env node*/

if (process.env.VCAP_SERVICES) {
  process.env.CLOUDANT_URL = JSON.parse(process.env.VCAP_SERVICES)
                                 .cloudantNoSQLDB[0].credentials.url;
} else { // Otherwise look for .env, which is a file of name/value pairs
  require('dotenv').config({silent: true});
}

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
