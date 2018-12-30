var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = require('../models/posts.model');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  Post.find({},function(err, data){
    if(err){
      req.flash('error', '查找错误');
      return res.redirect('/');
    }
    res.render('index', {
        title: '首页',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        posts: data,
        time:moment(new Date()).format('YY-MM-DD HH:mm:ss')
    });
  });
});

module.exports = router;
