const puppeteer = require('puppeteer');

async function test(text) {
    console.log(1)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //await page.setRequestInterception(true);

    await page.on('response', async (response) => {
        var url_ = response.url();
        var header = response.headers();
        var type = header['content-type'];
        //if (url_ == "https://capuk.org/ajax_search/capmoneycourses") {
        //    console.log('XHR response received');
        //    console.log(await response.json());
        //}
        console.log(type + ' ' + url_);
    }); 


    await page.goto('https://www.oxfordlearnersdictionaries.com');    

    await browser.close();
    console.log('??????????????????????????????')
}

const READ_LINE = require("readline");
const RL = READ_LINE.createInterface({ input: process.stdin, output: process.stdout });
RL.on("line", function (line) {
    let text = line.trim();
    switch (text) {
        case 'exit':
            process.exit();
            break;
        case 'cls':
            console.clear();
            break;
        default:
            test(text);
            break;
    }
});