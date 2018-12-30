var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/posts')
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();

//使用session
app.use(session({
    name: 'simpleBlog',
    secret: 'simpleBlog',
    cookie: {maxAge: 6000000},
    store: new MongoStore({url: 'mongodb://localhost/simpleBlog'}),
    resave: false,
    saveUninitialized: true
}));


/*app.use(function(req, res, next){
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
});*/
// 设置视图和视图渲染引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//使用工具
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

//配置路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter)
// 捕获错误
app.use(function(req, res, next) {
  next(createError(404));
});

// 错误处理器
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // 渲染错误页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
