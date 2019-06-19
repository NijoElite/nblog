const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  User.findOne({username: username}).
      then((user) => done(null, user)).
      catch((err) => done(err));
});

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({username: username}).then((user) => {
        if (!user) {
          return done(null, false);
        }

        user.validatePassword(password).then((isValid) => {
          if (isValid) {
            return done(null, user);
          }
          done(null, false);
        }).catch((err) => done(err));
      }).catch((err) => done(err));
    }
));

router.use('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
});

router.get('/', (req, res, next) => {
  res.render('auth/login');
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/login',
}));

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});


module.exports = router;
