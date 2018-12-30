var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var Post = require('../models/posts.model');
var moment = require('moment');
var formidable = require('formidable');
//博客管理
router.get('/post', function(req, res, next){
    res.render('post',{
        title: '发表',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});
router.post('/post', function(req, res){
    var imgPath = path.dirname(__dirname)+'/public/images/';
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = imgPath;
    form.keepExtensions = true;
    form.maxFieldsSize = 2*1024*1024;
    form.type = true;
    form.parse(req, function(err, fields, files){
        if(err){
            console.log(err);
            req.flash('error', '图片上传失败');
            return;
        }
        var file = files.postImg;

        if(file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/gif' && file.type != 'image/jpg'){
            console.log('文件格式上传失败');
            req.flash('error', '文件格式上传失败');
            return res.redirect('/upload');
        }

        var title = fields.title;
        var author = req.session.user.username;
        var article = fields.article;
        var postImg = file.path.split(path.sep).pop();
        var pv = fields.pv;

        try{
            if( !title.length){
                throw new Error('请填写标题');
            }
            if( !article.length){
                throw new Error('请填写内容');
            }
        }catch (e){
            req.flash('error', e.message);
            return res.redirect('back');
        }

        var post = new Post({
            title: title,
            author: author,
            article: article,
            postImg: postImg,
            publishTime: moment(new Date()).format('YY-MM-DD HH:mm:ss').toString(),
            pv: pv
        });

        post.save(function(err){
            if(err) {
                console.log('文章发表失败');
                req.flash('err', '文章发表失败');
                return res.redirect('/post');
            }
            console.log('文章发表成功');
            req.flash('err', '文章发表成功');
            return res.redirect('/');
        });
    });
});

router.get('/detail', function(req, res){
    var id = req.query.id;
    if(id && id != ''){
        Post.update({"_id": id}, {$inc:{'pv': 1}}, function(err){
            if(err){
                console.log(err);
                return res.redirect('back');
            }
            console.log('浏览数+1')
        });
        Post.findById( id, function(err, data){
            if(err){
                console.log(err);
                req.flash('error', '查看文章错误');
                return res.redirect('/');
            }
            res.render('detail', {
                title: '文章展示',
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                post: data,
                img: path.dirname(__dirname)+'/public/images'+data.postImg
            });
        })
    }
});

router.get('/edit/:author/:title', function(req, res){
    var id = req.query.id;
    Post.findById(id, function(err, data){
        if(err){
            req.flash('error', err);
            return res.redirect('back');
        }
        res.render('edit', {
            title:'编辑',
            post: data,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    })
})
router.post('/edit/:author/:title', function(req, res, next){
    var post = {
        id: req.query.id,
        author: req.session.user,
        title: req.body.title,
        article: req.body.article
    }
    console.log(post);

    post.article = markdown.toHTML(post.article);
    Post.update({'_id':post.id}, {$set:{title: post.title, article: post.article}}, function(err){
        if(err){
            console.log(err);
            return;
        }
        console.log('提交成功')
        res.redirect('/');
    })
})

router.get('/delete', function(req, res){
    var id = req.query.id;
    console.log(id);
    if(id && id != ''){
        Post.findByIdAndRemove(id, function(err){
            if(err){
                console.log(err);
                req.flash('error', '删除失败');
                return res.redirect('/');
            }
            req.flash('suceess', '删除成功');
            return res.redirect('/');
        })
    }
})

module.exports = router;
