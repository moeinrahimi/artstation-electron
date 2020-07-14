const puppeteer = require('puppeteer');
const axios = require('axios')
const fs = require('fs')
exports.run = async (q) => {
  console.log("exports.run -> q", q)
  try{
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  // we don't want to pressure on our bandwidth do we ? :)
  page.on('request', request => {
    if (request.resourceType() === 'image')
      request.abort();
    else
      request.continue();
  });

  let baseURL = `https://www.artstation.com/search?q=${encodeURI(q)}&sort_by=relevance`

    await page.goto(baseURL);
    await page.setDefaultNavigationTimeout(0);
  // await page.click('form [name="q"]')
  // await page.keyboard.type(searching)
  // await page.click('form [type="submit"]')

    let items = await page.evaluate(() => {
    let arr = []
    document.querySelectorAll(".gallery-grid-item").forEach(a => arr.push(a.children[0].children[2].src))
    // document.querySelectorAll(".gallery-grid-item").forEach(a => arr.push(a.children[0].href))
    return arr

  })

    console.log(items, 'items')
    return items
    // await page.goto(wallpaperPage);
    // let wallpapersLength = await page.evaluate(()=>{
    //   return  document.querySelectorAll('#single >  div > .wrap-image').length
    // })
    // console.log(wallpapersLength,'length')
    // let links = []
    // for(var i = 2;i<wallpapersLength;i++){
    //   let linkSelector = `#single > div:nth-child(${i}) > .wrap-image > a`
    //   const link = await page.evaluate((sel)=>{
    //     return  document.querySelector(sel).href.replace('/w/','/download/')
    //   },linkSelector)
    //   let {data} =await axios.get(link, {
    //     responseType: 'arraybuffer'
    // })
    //   let randomnumber = Math.floor(Math.random() * (1555 - 51 + 1)) + 51;
    //   fs.writeFileSync(`./images/${randomnumber}.jpg`,data)
    //   console.log(data)
    // }
    // await broweser.close()
  }catch(e){
    console.log(e,'got an error !')
  }
}
// run()
