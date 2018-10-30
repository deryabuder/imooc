var createError = require('http-errors');
var express = require('express');
// express4.X框架不支持layout模板的问题解决
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var favicon = require('static-favicon')
var cookieParser = require('cookie-parser');
// 大多数中间件（如会话）不再与Express捆绑，必须单独安装
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// express默认日志组件
var logger = require('morgan');
var bodyParser = require('body-parser')
var partials = require('express-partials')
var flash = require('connect-flash');
var settings = require('./settings')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// 视图文件的目录，存放模板文件
app.set('views', path.join(__dirname, 'views'));
// 使用的模板引擎是ejs
app.set('view engine', 'ejs');
// express的片段视图
app.use(partials());
app.use(favicon());
app.use(logger('dev'));

// json()方法从express分出来了
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
// 解析cookie
app.use(cookieParser());
// 配置了静态文件服务器
app.use(express.static(path.join(__dirname, 'public')));
// 通过它我们可以很方便地实现页面的通知和错误信息显示功能。
app.use(flash());
app.use(expressLayouts)

// express.session() 则提供会话支持，设置它的 store 参数为 MongoStore 实例，
// 把会话信息存储到数据库中，以避免丢失。
app.use(session({
  secret: settings.cookieSecret,
  store: new MongoStore({
    db: settings.db,
  })
}));

app.use(function (req, res, next) {
  console.log("app.usr local");
  res.locals.user = req.session.user;
  res.locals.post = req.session.post;
  var error = req.flash('error');
  res.locals.error = error.length ? error : null;

  var success = req.flash('success');
  res.locals.success = success.length ? success : null;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);


// 捕获404并转发到错误处理程序
app.use(function (req, res, next) {
  next(createError(404));
});

// 错误处理
app.use(function (err, req, res, next) {
  // 设置本地，只在开发中提供错误
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // 渲染错误页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;