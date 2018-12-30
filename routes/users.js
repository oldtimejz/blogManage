var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user.model');
var WXBizDataCrypt = require('../public/javascripts/WXBizDataCrypt.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/reg', function (req, res, next){
    res.render('reg', {
        title: '首页',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
    });
});
router.post('/reg', function(req, res){
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });

    if(req.body['password'] != req.body['password-repeat']){
        console.log("两次输入的密码不一致");
        return res.redirect('/');
    }

    User.findOne({'username':user.username}, function(err, data){
        if(err){
            req.flash('err', 'err');
            return res.redirect('/');
        }
        if(data != null){
            console.log('用户已存在');
            return res.redirect('/reg');
        } else{
            user.save(function(err){
                if(err){
                    console.log(err);
                    return res.redirect('/');
                }
                console.log('注册用户成功');
                res.redirect('/');
            });
        }
    });
});

router.get('/login', function (req, res, next){
    res.render('login', {
        title: '登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

router.post('/login', function(req, res){
    var password = req.body.password;
    console.log(res);
    User.findOne({'username': req.body.username}, function(err, data){
        if(err){
            console.log("err", 'err');
            return res.redirect('/');
        }
        if(!data){
            console.log('err','用户名不存在');
            return res.redirect('/');
        }
        if(data.password != password){
            console.log('err','密码不正确');
            return res.redirect('/login')
        }

        req.session.user = data;
        req.flash("success",'登录成功');
        res.redirect('/');
    });
});
router.get('/logout', function(req, res){
    req.session.user = null;
    req.flash('success','登出成功');
    res.redirect('/');
});

module.exports = router;
