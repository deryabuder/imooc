function changePage(element, effect, callback) {
  element
    .addClass(effect)
    .one("animationend webkitAnimationEnd", function () {
      callback && callback();
    })
}

function HTML5Audio(url, loop) {
  var audio = new Audio(url);
  audio.autoplay = true;
  audio.loop = loop || false; //是否循环
  audio.play();
  return {
    end: function (callback) {
      audio.addEventListener('ended', function () {
        callback()
      }, false);
    }
  }
}

var Christmas = function () {
  //页面容器元素
  var $pageA = $(".page-a");
  var $pageB = $(".page-b");
  var $pageC = $(".page-c");

  //观察者
  var observer = new Observer();

  new pageA($pageA, function () {
    observer.publish("completeA");
  });

  //页面A-B场景切换
  observer.subscribe("completeA", function () {
    changePage($pageA, "effect-out", function () {
      observer.publish("pageB");
    })
  })

  //进入B场景
  observer.subscribe("pageB", function () {
    new pageB($pageB, function () {
      observer.publish("completeB");
    });
  })

  //页面B-C场景切换
  observer.subscribe("completeB", function () {

    changePage($pageC, "effect-in", function () {
      observer.publish("pageC");
    })
  })
  //进入C场景
  observer.subscribe("pageC", function () {
    new pageC();
    new Snowflake("snowflake");
  })
};

$(function () {
  //圣诞主题效果，开始
  var audio1 = HTML5Audio('http://www.imooc.com/upload/media/one.mp3')
  audio1.end(function () {
    Html5Audio('http://www.imooc.com/upload/media/two.mp3', true)
  })
  Christmas();
})