const puppeteer = require('puppeteer');

module.exports = async function googleSearch(query, city, country) {
  if (query) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Navigate to Google
    await page.goto('https://www.google.com');

    await page.keyboard.type(String(`${query} ${city} ${country}`));

    await page.keyboard.press('Enter');

    await page.waitForSelector('h3');

    const results = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('h3'));
      return links.map((link) => {
        const title = link.innerText;
        const url = link.parentElement.href;
        return `${title} - ${url}`;
      });
    });

    await browser.close();
    return results;
  } else {
    console.log('You need to provide an argument');
  }
};
