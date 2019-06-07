const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'cant be blank'],
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, 'cant be blank'],
    ref: 'User',
  },
  article: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, 'cant be blank'],
    ref: 'Article',
  },

}, {timestamps: true});

mongoose.model('Comment', commentSchema);
