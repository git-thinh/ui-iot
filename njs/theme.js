var PORT = process.env.PORT;
const FETCH = require('node-fetch');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const HTTP = require('http');
const URL = require('url');
const QUERY_STRING = require('querystring');
const SERVER = HTTP.createServer(function (req, res) {
    const uri = URL.parse(req.url);
    const query = QUERY_STRING.parse(uri.query);

    if (query && query.url) {
        FETCH(query.url).then(r => r.text()).then(text => {
            //console.log(s);
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            res.write(text, "utf-8");
            res.end();
        });
    } else {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.write("", "utf-8");
        res.end();
    }
});
SERVER.listen(PORT);


function test(text) {
    FETCH('https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000').then(r => r.text()).then(s => {
        console.log(s);
    })
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