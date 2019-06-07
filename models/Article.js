const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug');

const articleSchema = new mongoose.Schema({
  slug: {type: String, lowercase: true, unique: true},
  title: {type: String, required: [true, 'cant be blank']},
  description: {type: String, required: [true, 'cant be blank']},
  body: {type: String, required: [true, 'cant be blank']},
  tagList: [{type: String}],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'cant be blank'],
    ref: 'User',
  },
}, {timestamps: true});

articleSchema.plugin(uniqueValidator, {message: 'is already taken'});

articleSchema.pre('validate', function(next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

articleSchema.methods.slugify = function() {
  this.slug = slug(this.title) + '-' +
      (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

mongoose.model('Article', articleSchema);
