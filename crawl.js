const scheduler = require("node-schedule");
const puppeteer = require('puppeteer');
const kakaoTalk = require("./kakaoTalk.js");
const linebot = require("./linebot.js");

async function restock(itemNum, size) {
  let url = "https://store.musinsa.com/app/goods/" + itemNum;
  while (true) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' }); //웹페이지 방문


    //품절인지 구매 가능한지 상태 확인
    await page.waitForSelector('.product-detail__sc-l8f2ek-2')
    const purchaseStatus = await page.$('.product-detail__sc-l8f2ek-2');
    const productTitle = await page.$eval('.product-detail__sc-1klhlce-3', el => el.textContent);

    if (purchaseStatus) {
      const status = await page.evaluate(el => el.textContent, purchaseStatus);
      if (status === '품절') {
        // '품절' 버튼이 있으면 브라우저 끄고 처음부터 다시 진행
        console.log(productTitle + " 품절이므로 재검색");
        await browser.close();
        continue;
      }
    }//여길 통과하면 '품절'이 아니라 '바로구매'버튼인 거임.

    //사이즈 별 옵션 확인 절차
    await page.waitForSelector('select.product-detail__sc-1d13nsy-1 option');
    const options = await page.$$eval('select.product-detail__sc-1d13nsy-1 option', options => options.map(option => ({ value: option.value, text: option.textContent })));

    let map = new Map();

    console.log(productTitle);
    for (let i = 1; i < options.length; i++) {
      console.log(options[i].value + " " + options[i].text);
      map.set(options[i].value, options[i].text);
    }

    console.log("사이즈: " + size);
    console.log("재고: " + map.get(size));

    let sizeOption = options.find(option => option.value === size);
    if (sizeOption && !sizeOption.text.includes('품절')) {
      // 해당 사이즈가 품절되지 않았을 때의 처리
      const msg = productTitle + " " + size + " 재고있음";
      console.log(msg);
      linebot.sendBot(msg);
      kakaoTalk.sendMessage(msg);
      break; //while문 종료
    }

    if (browser) {
      await browser.close();
    }
  }//while문의 경계

}



module.exports = {
  restock: restock,
};
