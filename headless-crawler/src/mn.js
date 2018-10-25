const puppeteer = require('puppeteer');
const {
  mn
} = require('./config/default');
const srcToImg = require('./helper/srcToImg');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://image.baidu.com/');
  console.log('go to https://image.baidu.com/');

  // 使页面放下更多的图片， 触发懒加载的次数减少
  await page.setViewport({
    width: 1920,
    height: 1080
  });
  console.log('reset viewport');

  //focus到input上
  await page.focus('#kw');
  // 进行键盘输入
  await page.keyboard.sendCharacter('狗');
  // 点击开始搜索
  await page.click('.s_btn');
  console.log('go to search list');

  // 页面加载完成后触发
  page.on('load', async () => {
    console.log('page loading done, start fetch...');
    // 回调函数获取想要的dom
    const srcs = await page.evaluate(() => {
      // 获取所有的图片， 并得到所有的url组成的数组
      // images 并不是数组，返回的对象是 NodeList 。
      const images = document.querySelectorAll('img.main_img');
      return Array.prototype.map.call(images, img => img.src);
    });
    console.log(`get ${srcs.length} images, start download`);

    // srcs.forEach(async (src) => {
    // sleep
    // await page.waitFor(200);
    // await srcToImg(src, mn);
    // });

    // 遍历所有的图片
    for (let i = 0; i < srcs.length; i++) {
      // sleep
      await page.waitFor(200);
      // 将图片存储在 mn 文件夹下
      await srcToImg(srcs[i], mn);
    }
    // 关闭浏览器实例
    await browser.close();
  })
})