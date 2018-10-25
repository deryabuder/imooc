const http = require('http');
const path = require('path');
const conf = require('./config/defaultConfig');
const route = require('./helper/route');
const openUrl = require('./helper/openUrl')

class Server {
  constructor(config) {
    // 将默认的conf和用户输入的config合并
    this.conf = Object.assign({}, conf, config);
  }

  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url);
      // 得到默认的conf和用户设置得config
      route(req, res, filePath, this.conf);
    });

    server.listen(this.conf.port, this.conf.hostname, () => {
      const addr = `http://${this.conf.hostname}:${this.conf.port}`;
      console.info(`Server started at ${addr}`);
      openUrl(addr)
    });
  }
}

module.exports = Server;