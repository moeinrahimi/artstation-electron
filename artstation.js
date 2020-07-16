const puppeteer = require('puppeteer');

exports.search = async (q) => {
  console.log(q, 'query');
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    );
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (['image', 'stylesheet', 'font','other'].includes(request.resourceType())) {
        request.abort();
    } else {
        request.continue();
    }
    });

    let baseURL = `https://www.artstation.com/search?q=${encodeURI(q)}&sort_by=relevance`;
    await page.goto(baseURL);
    await page.setDefaultNavigationTimeout(0);
    let items = await page.evaluate(() => {
      let arr = [];
      document.querySelectorAll('.gallery-grid-item').forEach((a) => {
        arr.push({
          thumbnail: a.children[0].children[2].src,
          artwork: a.children[0].href,
        });
      });
      return arr;
    });
    browser.close();
    return items;
  } catch (e) {
    console.log(e, 'got an error !');
  }
};

exports.getArtwork = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    );
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (['image', 'stylesheet', 'font','other'].includes(request.resourceType())) {
        request.abort();
    } else {
        request.continue();
    }

    });

    await page.goto(url);
    await page.setDefaultNavigationTimeout(0);

    let items = await page.evaluate(() => {
      let artworks = [];
      document.querySelectorAll('.asset-actions').forEach((dlBtn) => {
        artworks.push(dlBtn.children[0].href);
      });

      return artworks;
    });
    browser.close();

    return items;
  } catch (e) {
    console.log(e, 'got an error !');
  }
};
