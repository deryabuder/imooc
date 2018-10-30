// 引入需要的模块
var express = require('express');
var router = express.Router();
// crypto 是 Node.js 的一个核心模块，功能是加密并生成各种散列,我们代码中使用它计算了密码的散列值
var crypto = require('crypto');
// 导入的是构造函数， 构造函数内有name,password,get方法 原型上有save方法
var User = require('../models/user.js');
// 导入的是构造函数， 构造函数内有user,post,time,get方法 原型上有save方法
var Post = require("../models/post.js");

// 主页路由
router.get('/', function (req, res) {
  Post.get(null, function (err, posts) {
    // 请求post数据出错时
    if (err) {
      posts = [];
    }
    res.render('index', {
      title: '首页',
      posts: posts,
      user: req.session.user,
      // req.flash 是 Express 提供的一个奇妙的工具，通过它保存的变量只会在用户当前
      // 和下一次的请求中被访问，之后会被清除，
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

// 注册页路由
router.get("/reg", checkNotLogin);
// 渲染用户登录页面
router.get("/reg", function (req, res) {
  res.render("reg", {
    title: "用户注册"
  });
});

router.post("/reg", checkNotLogin);
// 获取注册页信息
router.post("/reg", function (req, res) {
  // 检验用户两次输入的口令是否一致
  if (req.body['password-repeat'] != req.body['password']) {
    req.flash('error', '两次输入的口令不一致');
    return res.redirect('/reg');
  }
  // 输出密码
  console.log(req.body['password'])

  var md5 = crypto.createHash('md5');
  // 生成密码的散列值
  var password = md5.update(req.body.password).digest('base64');
  // 实例化该用户
  var newUser = new User({
    name: req.body.username,
    password: password,
  });
  // 检查用户名是否已经存在， user是用户对象
  User.get(newUser.name, function (err, user) {
    if (user)
      err = 'Username already exists.';
    if (err) {
      req.flash('error', err);
      return res.redirect('/reg');
    }
    // 如果不存在则新增用户
    newUser.save(function (err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      req.session.user = newUser;
      req.flash('success', '注册成功');
      res.redirect('/');
    });
  });
});

// 登录页路由
router.get("/login", checkNotLogin);
// 载入登录页面
router.get("/login", function (req, res) {
  res.render("login", {
    title: "用户登入",
  });
});

router.post("/login", checkNotLogin);
// 获取登录信息
router.post("/login", function (req, res) {
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  // user是用户对象
  User.get(req.body.username, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/login');
    }
    if (user.password != password) {
      req.flash('error', '用户口令错误');
      return res.redirect('/login');
    }
    // 将登录成功的用户保存在session中
    req.session.user = user;
    req.flash('success', '登入成功');
    res.redirect('/');
  });
});

// 登出页路由
router.get("/logout", checkLogin);
router.get("/logout", function (req, res) {
  // 删除session中的用户信息
  req.session.user = null;
  req.flash('success', '登出成功');
  res.redirect('/');
});


function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登入');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登入');
    return res.redirect('/');
  }
  next();
}

// 发言路由
router.post("/post", checkLogin);
router.post("/post", function (req, res) {
  var currentUser = req.session.user;
  // 新建一个post实例，并将其保存在数据库中
  var post = new Post(currentUser.name, req.body.post);
  post.save(function (err) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', '发表成功');
    res.redirect('/u/' + currentUser.name);
  });
});

router.get("/u/:user", function (req, res) {
  // 用户路由，先获取用户，然后再获取用户post的微博
  User.get(req.params.user, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/');
    }
    Post.get(user.name, function (err, posts) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('user', {
        title: user.name,
        posts: posts,
      });
    });
  });
});


module.exports = router;