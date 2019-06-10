const express = require('express');
const router = new express.Router;

router.use('/users', require('./users'));
router.use('/articles/', require('./articles'));

// Errors
router.use(function(err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key) {
        errors[key] = err.errors[key].message;

        return errors;
      }, {}),
    });
  }
  next(err);
});

module.exports = router;
