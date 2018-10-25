const puppeteer = require('puppeteer')
const {
  screenshot
} = require('./con')

(async () => {
  // 传入配置项，返回浏览器实例
  const browser = await puppeteer.launch()
  // 返回page对象
  const page = await browser.newPage()
  // 将页面导航到指定url
  await page.goto('https://www.baidu.com')
  // 进行页面截图， 并保存在指定路径
  await page.screenshot({
    path: `${screenshot}/${Date.now()}.png`
  })
})()