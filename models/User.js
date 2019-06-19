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

  password: {
    type: String,
    required: [true, 'can\'t be blank'],
    minlength: [8, 'length must be at least 8'],
    select: false,
  },

  description: {
    type: String,
    default: 'The user did not have enough imagination to tell about himself.',
  },

  bio: {
    type: String,
    default: 'Apparently, the user has no significant achievements in life.',
  },

  favs: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Article',
  }],

  salt: {
    type: String,
    select: false,
  },
}, {timestamps: true});

userSchema.plugin(uniquireValidator, {message: 'is already taken'});

userSchema.methods.validatePassword = function(pass) {
  const User = mongoose.model('User');
  const promise = new Promise((resolve, reject) => {
    User.findById(this._id.toString()).select('password salt').then((user) =>{
      const hash = crypto.pbkdf2Sync(pass, user.salt, 10000, 512, 'sha512').
          toString();
      resolve(user.password === hash);
    }).catch((err) => reject(err));
  });

  return promise;
};

userSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  user.salt = crypto.randomBytes(16).toString('hex');
  user.password = crypto.pbkdf2Sync(user.password, user.salt,
      10000, 512, 'sha512');

  next();
});

mongoose.model('User', userSchema);
