const path = require('path');
const mimeTypes = {
  'css': 'text/css',
  'gif': 'image/gif',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'text/javascript',
  'json': 'application/json',
  'pdf': 'application/pdf',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'swf': 'application/x-shockwave-flash',
  'tiff': 'image/tiff',
  'txt': 'text/plain',
  'wav': 'audio/x-wav',
  'wma': 'audio/x-ms-wma',
  'wmv': 'video/x-ms-wmv',
  'xml': 'text/xml'
};

module.exports = (filePath) => {
  // 返回path的扩展名 .xxx
  let ext = path.extname(filePath)
    .split('.')
    .pop()
    .toLowerCase()
  // 没有扩展名的话
  if (!ext) {
    ext = filePath
  }
  // 返回扩展名对应的value， 如果没有的话，认为是txt类型
  return mimeTypes[ext] || mimeTypes['txt']
}