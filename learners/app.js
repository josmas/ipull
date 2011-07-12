var express = require('express');
var everyauth = require('everyauth');
var redis = require('redis');
var Learners = require('./learners').Learners;

function authTwitterLearner(session, accessToken, accessSecret, twitterUser) {
  // use session and accessToken and accessSecret to persist the auth?
  var learners = setupLearners();
  var promise = this.Promise();
  learners.getLearnerIdByTwitterId(twitterUser.id, function(error, learnerId) {
    if (error) throw error;
    promise.fulfill({id: learnerId, twitterId: twitterUser.id});    
  });  
  return promise;
}

everyauth
  .twitter
    .consumerKey(process.env.TwitterConsumerKey)
    .consumerSecret(process.env.TwitterConsumerSecret)
    .findOrCreateUser(authTwitterLearner)
    .redirectPath('/');

// facebook and google and linkedin and yahoo...

var app = module.exports = express.createServer(
    express.cookieParser()
  , express.session({ secret: process.env.SessionSecret })
  , everyauth.middleware()
);

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + "/public"));  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

var port, redisConnect;

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  port = 3000;
  
  redisConnect = redis.createClient;  
});

app.configure('production', function() {
  app.use(express.errorHandler());
  port = process.env.PORT;
  if (!port) throw("Need the port!");
  
  redisConnect = function() {
    var url   = require("url").parse(process.env.REDISTOGO_URL);
    var client = redis.createClient(url.port, url.hostname);
    client.auth(url.auth.split(":")[1]);
    return client;
  };
});

function setupLearners() {
  var client = redisConnect();
  // handle client errors
  var learners = new Learners(client);
  return learners;
}

// Routes

app.get('/', function(_, res) {
  res.render('index', {title: ""});
});

everyauth.helpExpress(app);

if (!module.parent) {
  app.listen(port, function() {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);  
  });
}