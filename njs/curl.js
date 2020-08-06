const PORT = process.env.PORT;
//const PORT = 12345;

const _ = require('lodash');
const FETCH = require('node-fetch');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const HTTP = require('http');
const URL = require('url');
const QUERY_STRING = require('querystring');
const CACHES = [];

const SERVER = HTTP.createServer(function (req, res) {
    const uri = URL.parse(req.url);
    const query = QUERY_STRING.parse(uri.query);
    var link = query.url;
    
    if (query && link) {
        var htm = _.find(CACHES, function (o) { return o.Url == link; });
        //console.log(htm == null, link);
        if (htm) {
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            res.write(htm.Html, "utf-8");
            res.end();
        } else {
            FETCH(link).then(r => r.text()).then(text => {
                CACHES.push({ Url: link, Html: text });
                //console.log(s);
                res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                res.write(text, "utf-8");
                res.end();
            });
        }
    } else {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.write("", "utf-8");
        res.end();
    }
});

SERVER.listen(PORT, function () {
    console.log(PORT);
});