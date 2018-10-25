const {
  cache
} = require('../config/defaultConfig');

function refreshRes(stats, res) {
  const {
    maxAge,
    expires,
    cacheControl,
    lastModified,
    etag
  } = cache;

  if (expires) {
    res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString());
  }

  if (cacheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
  }

  if (lastModified) {
    res.setHeader('Last-Modified', stats.mtime.toUTCString());
  }

  if (etag) {
    res.setHeader('ETag', `${stats.size}-${stats.mtime.toUTCString()}`); // mtime 需要转成字符串，否则在 windows 环境下会报错
  }
}
// 返回true的话，客户端可以使用缓存
module.exports = function isFresh(stats, req, res) {
  refreshRes(stats, res);

  const lastModified = req.headers['if-modified-since'];
  const etag = req.headers['if-none-match'];
  // 第一次请求资源
  if (!lastModified && !etag) {
    return false;
  }
  // 客户端的参数和服务器不一样
  if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
    return false;
  }

  if (etag && etag !== res.getHeader('ETag')) {
    return false;
  }

  return true;
};