const path = require('path')

module.exports = {
  // 获取screenshot和mn的绝对路径
  screenshot: path.resolve(__dirname, '../../screenshot/'),
  mn: path.resolve(__dirname, '../../mn')
}