window.onload = function () {
  waterfall('main', 'box');
  var dataInt = {
    'data': [{
      'src': '1.jpg'
    }, {
      'src': '2.jpg'
    }, {
      'src': '3.jpg'
    }, {
      'src': '4.jpg'
    }]
  };

  window.onscroll = function () {
    if (checkscrollside()) {
      var oParent = document.getElementById('main'); // 父级对象
      for (var i = 0; i < dataInt.data.length; i++) {
        var oPin = document.createElement('div'); //添加 元素节点
        oPin.className = 'pin'; //添加 类名 name属性
        oParent.appendChild(oPin); //添加 子节点
        var oBox = document.createElement('div');
        oBox.className = 'box';
        oPin.appendChild(oBox);
        var oImg = document.createElement('img');
        oImg.src = '../images/' + dataInt.data[i].src;
        oBox.appendChild(oImg);
      }
      waterfall('main', 'box');
    };
  }
}

function waterfall(parent, box) {
  var oParent = document.getElementById(parent)
  // 假设父元素还包括class为box以外的子元素
  var oBoxs = getByClass(oParent, box)
  // 获取图片占用空间的宽度
  var oBoxW = oBoxs[0].offsetWidth
  // 获取页面宽度
  var cols = Math.floor(document.documentElement.clientWidth / oBoxW)
  // 设置 main 的宽度
  oParent.style.cssText = 'width: ' + oBoxW * cols + 'px;margin: 0 auto;'
  var hArr = [];
  for (var i = 0; i < oBoxs.length; i++) {
    if (i < cols) {
      hArr.push(oBoxs[i].offsetHeight);
    } else {
      // 获取数组中的最小值及其索引
      var minH = Math.min.apply(null, hArr);
      var index = getMinhIndex(hArr, minH)
      oBoxs[i].style.position = 'absolute'
      oBoxs[i].style.top = minH + 'px'
      // oBoxs[i].style.left = oBoxW *index + 'px'
      oBoxs[i].style.left = oBoxs[index].offsetLeft + 'px'
      hArr[index] += oBoxs[i].offsetHeight;
    }
  }
}

function getByClass(parent, clsName) {
  var boxArr = []
  // 取出父元素所有子元素
  var oElements = parent.getElementsByTagName('*')
  for (var i = 0; i < oElements.length; i++) {
    if (oElements[i].className == clsName) {
      boxArr.push(oElements[i])
    }
  }
  return boxArr
}

function getMinhIndex(arr, val) {
  for (var i in arr) {
    if (arr[i] == val) {
      return i
    }
  }
}
// 检测是否具备了滚动条加载数据块的条件
function checkScrollSlide() {
  var oParent = document.getElementById('main')
  var oBoxs = getByClass(oParent, 'box')
  var lastBoxH = oBoxs[oBoxs.length - 1].offsetTop + Math.floor(oBoxs[oBoxs.length - 1].offsetHeight / 2)
  // 混杂模式或标准模式
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop
  // 浏览器窗口的高度
  var height = document.body.clientHeight || document.documentElement.clientHeight
  return (lastBoxH < scrollTop + height) ? true : false
}