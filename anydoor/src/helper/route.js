const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
// util.promisify(original)
const promisify = require('util').promisify;
// 文件的基本信息， 判断文件类型
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');
// 尽量使用绝对路径
// __dirname: f:\github\anydoor\src\helper
const tplPath = path.join(__dirname, '../template/dir.tpl');
// 只执行一次，以后使用缓存, 添加第二个参数'utf-8'可以将buffer转换为字符串

// 同步读取模板文件
const source = fs.readFileSync(tplPath);
// 预编译模板
const template = Handlebars.compile(source.toString());

module.exports = async function (req, res, filePath, config) {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const contentType = mime(filePath);
      res.setHeader('Content-Type', contentType);
      // fs.readFile(filePath, (err, data) => {
      //   res.end()
      // })
      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      let rs;
      const {
        code,
        start,
        end
      } = range(stats.size, req, res);
      if (code === 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      } else {
        res.statusCode = 206;
        rs = fs.createReadStream(filePath, {
          start,
          end
        });
      }
      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
    } else if (stats.isDirectory()) {
      // 异步调用使用await关键字
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      const dir = path.relative(config.root, filePath);
      const data = {
        // path.basename() 方法返回一个 path 的最后一部分
        title: path.basename(filePath),
        // path.relative() 方法返回从 from 到 to 的相对路径（基于当前工作目录）。
        dir: dir ? `/${dir}` : '',
        files: files.map(file => {
          return {
            file,
            icon: mime(file)
          }
        })
      };
      res.end(template(data));
    }
  } catch (ex) {
    console.error(ex);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${filePath} is not a directory or file\n ${ex.toString()}`);
  }
}