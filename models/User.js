const mongoose = require('mongoose');
const uniquireValidator = require('mongoose-unique-validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
  },

  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
  },

  hash: String,
  salt: String,
}, {timestamps: true});

userSchema.plugin(uniquireValidator, {message: 'is already taken'});

userSchema.methods.validatePassword = function(pass) {
  const hash = crypto.pbkdf2Sync(pass, this.salt, 10000, 512, 'sha512').
      toString();
  return this.hash === hash;
};

userSchema.methods.setPassword = function(pass) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(pass, this.salt, 10000, 512, 'sha512');
};

mongoose.model('User', userSchema);
