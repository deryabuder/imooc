const yargs = require('yargs');
const Server = require('./app');
// 通过 node src/index.js 启动， 或直接在ide里运行
// 运行之后会自动打开网页
const argv = yargs
  .usage('anywhere [options]')
  .option('p', {
    alias: 'port',
    describe: '端口号',
    default: 9527
  })
  .option('h', {
    alias: 'hostname',
    describe: 'host',
    default: '127.0.0.1'
  })
  .option('d', {
    alias: 'root',
    describe: 'root path',
    default: process.cwd()
  })
  .version()
  .alias('v', 'version')
  .help()
  .argv;

const server = new Server(argv);
server.start();