const mongoose = require('mongoose');
const config = require('../config/config');

//链接到数据库
mongoose.connect(config.mongodb,{useNewUrlParser:true}, function(err){
    if(err) console.log(err)
});

var user = new mongoose.Schema({
    username: String,
    password: String,
    email: String
});

var User = mongoose.model('User', user);
//将实体暴露出去
module.exports = User;