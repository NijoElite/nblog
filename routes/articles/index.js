const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Comment = mongoose.model('Comment');


// Preload Article
router.param('article', function(req, res, next, slug) {
  Article.findOne({slug: slug})
      .populate('author')
      .then((article) => {
        if (!article) {
          return res.status(404).json({error: {
            title: 'Article Not Found',
          }});
        }
        req.paramArticle = article;
        next();
      })
      .catch(next);
});

// Get All Articles
router.get('/', function(req, res, next) {
  Article.find({})
      // .populate('author')
      .then((articles) => res.status(200).json(articles))
      .catch(next);
});

// Get Article
router.get('/:article', function(req, res, next) {
  res.status(200).json(req.paramArticle);
});

// Get Article comments
router.get('/:article/comments', function(req, res, next) {
  Comment.find({artcle: {_id: req.paramArticle._id}})
      .then((comments) => res.status(200).json(comments))
      .catch(next);
});

// Create Article
// TODO: implement method

// Delete Article
router.delete('/:article', function(req, res, next) {
  Article.deleteOne({_id: req.paramArticle._id})
      .then(() => res.status(204).send())
      .catch(next);
});

module.exports = router;
