// This code can run in four different environments:
// A) In a Docker container
// B) In a Docker container running in a Kubernetes cluster
// C) In the cloud in a Cloud Foundry environment
// D) Standalone on an in-house machine.

// There are three possibilities for how credentials are available to this
// code:
// 1) They're environment variables, set outside this code before the
//    process starts (applies to environments A and B above)
// 2) They're available through the VCAP_SERVICES environment variable
//    provided by the Cloud Foundry runtime (environment C)
// 3) They're availble in the .env file in the current directory
//    (environment D).

// Obviously we want a single app that works in all of the combinations of
// environments and credentials. Sooooo, here's what we do:

// Check to see if the VCAP_SERVICES environment variable exists. This
// should only exist when running in the cloud in a Cloud Foundry
// environment (environment C).
// If there is no VCAP_SERVICES defined, we call the NPM dotenv package to
// read the .env file. We call the package so that it fails quietly if the
// .env file doesn't exist (environment D).
// If the environment variables we're looking for are already defined
// (environments A and B), VCAP_SERVICES won't be defined and the dotenv
// package doesn't overwrite them. (Most likely there is no .env file, but
// even if there is, it doesn't impact the environment variables).

// Look at VCAP_SERVICES if it exists. Note that this is JSON data.
if (process.env.VCAP_SERVICES) {
  process.env.CLOUDANT_URL = JSON.parse(process.env.VCAP_SERVICES)
                                 .cloudantNoSQLDB[0].credentials.url;
} else { // Otherwise look for .env, which is a file of name/value pairs
  require('dotenv').config({silent: true});
}

// The default port number MUST be whatever the Cloud Foundry environment
// has defined in the PORT variable. Otherwise your app will fail to deploy
// to Bluemix with a mysterious health check error.
const port = process.env.PORT || 8080;

// Just hardcoding the database name, should probably be an env var
const dbname = 'webinar';

// Credentials should be in order, so we're ready to go now. If not,
// this is going to fail pretty quickly.

var Cloudant = require('cloudant');
var cloudant, cloudantDB;

// Now open the database. If it doesn't exist, it is created. The URL
// for Cloudant is in the form https://user name:password@address, so
// we don't have to pass the username and password separately.
cloudant = Cloudant(process.env.CLOUDANT_URL);
cloudant.db.create(dbname);
cloudantDB = cloudant.use(dbname);

if (cloudantDB === null)
  console.warn('Could not find or create the database!');
else
  console.log('The database seems to be fine.');



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
