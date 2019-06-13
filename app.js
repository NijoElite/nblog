const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const passport = require('passport');
const session = require('express-session');
const moment = require('moment');

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

// Connect to DB
mongoose.set('debug', !isProduction);

mongoose.connect(config.mongodb_uri, {useNewUrlParser: true})
    .then(() => {
      console.log(moment().format() +
      ' [mongoose] connection established to '
      + config.mongodb_uri);
    })
    .catch((err) => {
      console.error(moment().format() +
      ' [mongoose] connection error '
      + err);
      process.exit(1);
    });


// Mongoose models
require('./models/User');
require('./models/Article');
require('./models/Comment');

// Express config
app.set('view engine', 'pug');

app.locals.moment = moment;

// Static files
app.use(express.static('public'));

// Middlewares
app.use(express.urlencoded());
app.use(session({
  secret: config.secret, resave: false, saveUninitialized: false,
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes'));

// Handle 404
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  err.message = 'Page doesn\'t exist';
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({status: err.status, message: err.message});
});

// start server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + server.address().port);
});

