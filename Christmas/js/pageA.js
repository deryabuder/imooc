/**
 * 第一副场景页面
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
function pageA(element, callback) {
  //根元素
  this.$root = element;
  //小男孩
  this.$boy = element.find(".chs-boy");
  // 窗户
  this.$window = element.find('.window')
  this.$leftWin = this.$window.find('.window-left')
  this.$rightWin = this.$window.find('.window-right')
  //运行动画
  this.run();
  // 模拟执行时间
  setTimeout(function() {
    callback()
  }, 20000)
}

/**
 * 开窗
 * @return {[type]} [description]
 */

pageA.prototype.openWindow = function (callback) {
  var count = 1
  var complete = function () {
    ++count
    if (count === 2) {
      // 结束后执行回调函数
      callback && callback()
    }
  }
  var bind = function (data) {
    // transition 结束时触发
    data.one('transitionend webkitTransitionEnd', function (event) {
      // 动画结束后，执行回调函数
      data.removeClass('window-transition')
      complete()
    })
  }
  bind(this.$leftWin.addClass('window-transition').addClass('hover'))
  bind(this.$rightWin.addClass('window-transition').addClass('hover'))
  
}

/**
 * 运行下一个动画
 * @return {Function} [description]
 */
pageA.prototype.next = function (options) {
  // 返回一个链式对象
  var dfd = $.Deferred();
  this.$boy.transition(options.style, options.time, "linear", function () {
    dfd.resolve()
  });
  return dfd;
}


/**
 * 停止走路
 * @return {[type]} [description]
 */
pageA.prototype.stopWalk = function () {
  // 这个类提供了原地行走的效果
  this.$boy.removeClass("chs-boy-deer")
}


/**
 * 路径
 * @return {[type]} [description]
 */
pageA.prototype.run = function (callback) {
  var that = this;
  // 在当前this下执行这个函数
  var next = function () {
    return this.next.apply(this, arguments)
  }.bind(this)

  // 对这个元素整体进行移动，放大， 缩小，背景图的大小是相对于元素的
  next({
      "time": 10000,
      "style": {
        "top": "4rem",
        "right": "16rem",
        "scale": "1.2"
      }
    })
    .then(function () {
      return next({
        "time": 500,
        "style": {
          "rotateY": "-180",
          "scale": "1.5"
        }
      })
    })
    .then(function () {
      return next({
        "time": 7000,
        "style": {
          "top": "7.8rem",
          "right": "1.2rem"
        }
      })
    })
    .then(function () {
      that.stopWalk()
      that.openWindow()
    })
}