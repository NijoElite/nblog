const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Comment = mongoose.model('Comment');
const Article = mongoose.model('Article');


router.post('/', function(req, res, next) {
    const newComment = new Comment({
        text: req.body.text,
        
    });
});


module.exports = router;
