const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

// Preload User to req
router.param('username', function(req, res, next, username) {
  User.findOne({username: username})
      .then((user) => {
        if (!user) {
          return res.status(404).render('error', {error: {
            username: 'User Not Found',
          }});
        }

        req.paramUser = user;

        next();
      })
      .catch(next);
});

// User List
router.get('/', function(req, res, next) {
  User.find({})
      .then((users) => res.status(200).render('users/userList', {users: users}))
      .catch((err) => next(err));
});

// New User
router.post('/', function(req, res, next) {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  newUser.save((err, user) => {
    if (err) {
      return next(err);
    }

    res.status(202).json({username: user.username});
  });
});

// User Page
router.get('/:username', function(req, res, next) {
  if (req.xhr) {
    res.json(req.paramUser);
  } else {
    res.status(200).render('users/userPage', req.paramUser);
  }
});

// Delete User
router.delete('/:username', function(req, res, next) {
  User.deleteOne({_id: req.paramUser._id})
      .then(() => res.status(204).send())
      .catch(next);
});

module.exports = router;
