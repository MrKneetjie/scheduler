const fs = require('fs');
const papa = require('papaparse');
const { chromium } = require('playwright');
const { isContext } = require('vm');

const file = fs.createReadStream('test.csv');

papa.parse(file, {
    headers: true,
    complete: function(results) {
       for(result in results){
        (async () => {
            const browser = await chromium.launch();
            // Create pages, interact with UI elements, assert values
            await browser.close();
        })();
       }
    }
});


(async () => {
  const browser = await chromium.launch({
    headless: false
  });

 const context = await browser.newContext();

 const page = await context.newPage()

 await page.goto('https://www.reddit.com/api/v1/authorize?client_id=Xc_jVVwUqldDIg&response_type=code&redirect_uri=https%3A%2F%2Fonlybands.xyz%2Freddit_api%2Foauth_callback&state=606dd1ae9ebbd849b5558dd5&duration=permanent&scope=account%20edit%20history%20identity%20mysubreddits%20privatemessages%20read%20report%20save%20submit%20vote')
})();