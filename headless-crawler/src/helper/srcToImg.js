const fs = require('fs')
const http = require('http')
const https = require('https')
const path = require('path')
const {
  promisify
} = require('util')
const writeFile = promisify(fs.writeFile)

module.exports = async (src, dir) => {
  if (/\.(jpg|png|gif)$/.test(src)) {
    await urlToImg(src, dir);
  } else {
    await base64ToImg(src, dir);
  }
};

// url => img
// 图片url，dir是存储的路径
const urlToImg = promisify((url, dir, callback) => {
  // 判断url是https还是http
  const mod = /^https:/.test(url) ? https : http;
  // 获取文件的扩展名
  const ext = path.extname(url);
  // 将时间戳作为文件名， 拼接得到完整的文件路径
  const file = path.join(dir, `${Date.now()}${ext}`);

  // http 或 https是发送一个get请求
  mod.get(url, res => {
    // 将文件写入本地
    res.pipe(fs.createWriteStream(file))
      // 文件写入完成后，执行回调函数
      .on('finish', () => {
        callback();
        console.log(file);
      })
  })
})

// base64 => image
const base64ToImg = async function (base64Str, dir) {
  // base64字符串格式: data:image/jpeg;base64,/afhieufbei
  const matches = base64Str.match(/^data:(.+?);base64,(.+)$/);
  // 防止解析过程出现问题
  try {
    // 获取格式，并进行转换
    const ext = matches[1].split('/')[1]
      .replace('jpeg', 'jpg');

    // 获取完整的文件路径
    const file = path.join(dir, `${Date.now()}.${ext}`);
    // 将base64格式的mathes[2]写入文件
    await writeFile(file, matches[2], 'base64');
    console.log(file);
  } catch (ex) {
    console.log('非法 base64 字符串');
  }
};