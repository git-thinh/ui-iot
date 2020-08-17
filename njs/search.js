//const PORT = process.env.PORT;
const PORT = 8081;
const HTTP = require('http');

const _ = require('lodash');
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const _JOB = require('cron').CronJob;

let IS_WRITING = false;
const INDEX = {};
const CHANGED = [];
const SCHEMA = [];
const CACHE = [];

const self = require('./self.js')
//---------------------------------------------------------------------------------------------------------------------------------------

const KUE = require('kue'), QUEUE = KUE.createQueue({
    prefix: 'q',
    redis: { port: 5000, host: '127.0.0.1', db: 3 }
});
QUEUE.process('WRITE_FILE', 5, function (job, ctx, done) {
    let item;
    try {
        item = job.data;
        if (item) {
            const file = __dirname + '/data/' + item.___id + '.json';
            console.log('JOB_DONE: ?? = ', file);
            require('fs').writeFile(file, JSON.stringify(item), 'utf8', function (err) {
                console.log('JOB_DONE: OK = ', file);
                if (err) {
                    done({ Ok: false, Message: e.message });
                } else {
                    done({ Ok: true, Id: item.___id });
                }
            });
        } else {
            done({ Ok: false, Message: 'Paramenter is NULL' });
        }
    } catch (e) {
        done({ Ok: false, Message: e.message });
    }
});
function jobCreateNewCallback(item) {
    console.log('JOB_OK', item);
}
function jobCreateNew(item) {
    QUEUE.create('WRITE_FILE', item).save(jobCreateNewCallback);
}

//---------------------------------------------------------------------------------------------------------------------------------------

function subcribleDataChanged(item) {
    jobCreateNew(item);
}

function responseWrite(data, response) {
    data = data || '';
    if (typeof data == 'object') data = JSON.stringify(data);
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    response.write(data, 'utf-8');
    response.end();
}

function add(item, response) {
    const o = item.Input;
    const id = ___guid(item.Schema);

    let result = { Ok: false, Action: 'ADD', Id: id, Schema: item.Schema, Data: null, Message: '', Request: item };

    o['___id'] = id;
    o['___ix'] = CACHE.length;
    o['___sc'] = item.Schema;

    var notExist = _.findIndex(SCHEMA, function (x) { return x == item.Schema; }) == -1;
    if (notExist) SCHEMA.push(item.Schema);

    let valid = true;
    if (item.Condition && CACHE.length > 0) {
        valid = false;
        let condition = 'o != null && o.___sc == "' + item.Schema + '" && (\r\n' + item.Condition + '\r\n)';
        var _temp = _.template(condition);
        condition = _temp(item.Input);
        //console.log(condition);

        const f = new Function('o', 'return ' + condition);
        const max = CACHE.length;
        let it;
        for (var i = 0; i < max; i++) {
            it = CACHE[i];
            if (f(it)) {
                valid = true;
                break;
            }
        }
        if (!valid) {
            result.Message = 'Condition is invalid, please check Condition or Input data again.';
            result.Data = it;
        }
    }

    if (valid) {
        CACHE.push(o);
        result.Data = o;

        //subcribleDataChanged(o);
    }
    result.Ok = valid;

    responseWrite(result, response);
}

function update(item, response) {
    if (item.Id == 0) responseWrite({ Ok: false, Action: 'UPDATE', Id: item.Id, Schema: item.Schema }, response);
    const o = item.Input;
    o['___id'] = item.Id;
    o['___sc'] = item.Schema;
    CACHE.push(o);
    var index = _.findIndex(CACHE, function (x) { return x.Id == item.Id && x.Schema == item.Schema; });
    if (index != -1) CACHE[index] = o;
    responseWrite({ Ok: (index != -1), Action: 'UPDATE', Id: item.Id, Schema: item.Schema }, response);
}

function remove(item, response) {
    var index = _.findIndex(CACHE, function (x) { return x.Id == item.Id && x.Schema == item.Schema; });
    //if (index != -1) CACHE.splice(index, 1);
    if (index != -1) CACHE[index] = null;
    responseWrite({ Ok: (index != -1), Action: 'UPDATE', Id: item.Id, Schema: item.Schema }, response);
}

function search(item, response) {
    let o = { Ok: true, Data: [], Request: item, Total: 0 };
    try {
        if (item.Condition) {
            let condition = 'o != null && o.___sc == "' + item.Schema + '" && (\r\n' + item.Condition + '\r\n)';
            const f = new Function('o', 'return ' + condition);
            const arr = _.filter(CACHE, f);
            o.Total = arr.length;
            o.Data = arr;
        }
    } catch (e) {
        o.Ok = false;
        o.Message = 'Error:' + e.message + '. Format search must be: {Schema:"..", Conditions:" o.Id == 123 && o.Name ... "}';
    }
    responseWrite(o, response);
}

function listData(item, response) { responseWrite(CACHE, response); }
function listSchema(item, response) { responseWrite(SCHEMA, response); }

new _JOB('*/5 * * * * *', function () {
    //console.log(new Date().toString());
    if (IS_WRITING || CHANGED.length == 0) {
        IS_WRITING = false;
        return;
    }
}).start();

HTTP.createServer(function (request, response) {
    const { headers, method, url } = request;
    //headers['token'] to valid

    if (method != 'POST' && url != '/add' && url != '/update'
        && url != '/remove' && url != '/search' && url != '/list' && url != '/schema')
        return responseWrite('', response);

    const body = [];
    request.on('error', (err) => {
        console.error('REQUEST.ERROR: ', err);
    }).on('data', (chunk) => { body.push(chunk); }).on('end', () => {
        try {
            const text = Buffer.concat(body).toString();
            let item;
            if (url == '/add' || url == '/update' || url == '/remove') {
                try {
                    item = JSON.parse(text);
                } catch (e1) {
                    return responseWrite({ Ok: false, Message: 'Occur a error about convert JSON of input request' }, response);
                }
                if (!item.hasOwnProperty('Id') || !item.hasOwnProperty('Schema') ||
                    typeof item.Schema != 'string' || !item.hasOwnProperty('Input') || typeof item.Input != 'object')
                    return responseWrite({ Ok: false, Message: 'Data POST must be format: {Id:..., Schema: "...",Input: {...}}' }, response);
            }
            item = item || {};
            if (item.Schema) item.Schema = item.Schema.toLowerCase().trim();
            switch (url) {
                case '/add': return add(item, response);
                case '/update': return update(item, response);
                case '/remove': return remove(item, response);
                case '/search': return search(item, response);
                case '/list': return listData(item, response);
                case '/schema': return listSchema(item, response);
                default: return responseWrite('', response);
            }
        } catch (e) {
            return responseWrite({ Ok: false, Message: 'Occur an error: ' + e.message }, response);
        }
    });
}).listen(PORT);

var temp = '{{o.___sc}}|{{self.yyMMddHHmmss()}}|{{self.uuid()}}';
var _temp = _.template(temp);
var s = _temp({
    o: {
        ___sc: 'comment'
    },
    self: self
});
console.log(s);
