﻿//const PORT = process.env.PORT;
const PORT = 8081;
const HTTP = require('http');
const URL = require('url');
const QUERY_STRING = require('querystring');

const PATH = require('path');
global._FS = require('fs');
const self = require('./self.js');
const _ = require('lodash');
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
global._lodashComplite = function (template, obj) {
    try {
        const _temp = _.template(template);
        const text = _temp({ it: obj, self: self });
        return text;
    } catch (e) {
        console.log('_lodashComplite: ERROR = ', template, obj, e);
        return '';
    }
};

global.MAXID = 0;
const _JOB = require('cron').CronJob;

let IS_WRITING = false;
const CHANGED = [];
const SCHEMA = [];
const CACHE = [];

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
            //console.log('JOB_DONE: ?? = ', file);
            _FS.writeFile(file, JSON.stringify(item), 'utf8', function (err) {
                if (err) {
                    console.log('JOB_DONE: ER = ', err);
                    done({ Ok: false, Message: err.message });
                } else {
                    //console.log('JOB_DONE: OK = ', file);
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
function jobCreateNewCallback(message) {
    console.log('JOB_CALLBACK: id = ', message.Data.___id, message.Error == null);
    //console.log('JOB_CALLBACK: data = ', message.Data.___id);
    //console.log('JOB_CALLBACK: error = ', message.Error);
}
function jobCreateNew(item) {
    const job = QUEUE.create('WRITE_FILE', item).save(function (err) {
        jobCreateNewCallback({ Error: err, Data: job.data });
    });
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
    const it = item.Input,
        schema = item.Schema,
        condition = item.Condition;
    it['___sc'] = schema;
    it['___dt'] = self.yyMMddHHmmss();

    const id = self.cacheBuildNewId(it);
    it['___id'] = id;
    let result = { Ok: false, Action: 'ADD', Id: id, Schema: schema, Data: null, Message: '' };//, Request: item };

    //----------------------------------------------------------------------

    const keys = Object.keys(it);
    for (var i = 0; i < keys.length; i++) {
        const val = it[keys[i]];
        if (val && typeof val == 'string' && self.hasOwnProperty(val)) {
            it[keys[i]] = self[val](it);
        }
    }

    //----------------------------------------------------------------------

    var notExist = _.findIndex(SCHEMA, function (x) { return x == schema; }) == -1;
    if (notExist) SCHEMA.push(schema);

    let valid = 1;
    if (condition && CACHE.length > 0) {
        let jsCondition = _lodashComplite(condition, it);
        if (jsCondition.length == 0) {
            result.Message = 'Occur an error when compile condition';
            valid = -1;
        } else {
            const arr = _.filter(CACHE, function (o) { return o != null && o.___sc == schema; });
            const max = arr.length;
            if (max == 0) {
                valid = 1;
            } else {
                //console.log('jsFunc = ', jsCondition, arr.length);
                try {
                    const f = new Function('it', 'return ' + jsCondition);
                    let itExist;
                    for (var i = 0; i < max; i++) {
                        const o = arr[i];
                        //console.log(o.UserName, f(o))
                        if (f(o) == false) {
                            valid = 0;
                            itExist = o;
                            break;
                        }
                    }

                    if (valid == 0) {
                        result.Message = 'Input data is invalid while checking conditions';
                        result.Data = itExist;
                    }
                } catch (ec) {
                    valid = -1;
                    result.Message = 'ERROR: Occur an error while checking conditions. ' + ec.message
                }
            }
        }
    }

    if (valid == 1) {
        it['___ix'] = CACHE.length;
        CACHE.push(it);
        result.Data = it;
        setTimeout(function () { subcribleDataChanged(it); }, 1);
    }
    result.Ok = valid == 1;
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
    const it = item.Input,
        schema = (item.Schema || '').toLowerCase(),
        condition = item.Condition;
    let result = { Ok: true, Action: 'SEARCH', Schema: schema, Data: [], Message: '' };
    //----------------------------------------------------------------------

    const keys = Object.keys(it);
    for (var i = 0; i < keys.length; i++) {
        const val = it[keys[i]];
        if (val && typeof val == 'string' && self.hasOwnProperty(val)) {
            it[keys[i]] = self[val](it);
        }
    }

    //----------------------------------------------------------------------

    var notExist = _.findIndex(SCHEMA, function (x) { return x == schema; }) == -1;
    if (notExist || schema.length == 0) {
        result.Ok = false;
        result.Message = 'Cannot find schema: ' + schema;
        return responseWrite(result, response);
    }

    if (condition && CACHE.length > 0) {
        let jsCondition = _lodashComplite(condition, it);
        if (jsCondition.length > 0) {
            const arr = _.filter(CACHE, function (o) { return o != null && o.___sc == schema; });
            const max = arr.length;
            if (max > 0) {
                //console.log('jsFunc = ', jsCondition, arr.length);
                try {
                    const f = new Function('it', 'return ' + jsCondition);
                    result.Data = _.filter(arr, f);
                } catch (ec) {
                    result.Ok = false;
                    result.Message = 'ERROR: Occur an error while checking conditions. ' + ec.message;
                    return responseWrite(result, response);
                }
            }
        }
    }

    result.Ok = true;
    responseWrite(result, response);
}

function listData(item, response) { responseWrite(CACHE, response); }
function listSchema(item, response) { responseWrite(SCHEMA, response); }
function cacheCleanAll(item, response) { CACHE = []; responseWrite('', response); }
function restoreCache() {
    const directoryPath = PATH.join(__dirname, 'data');
    _FS.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function (file) {
            const fi = PATH.join(directoryPath, file);
            _FS.readFile(fi, 'utf8', function (err, text) {
                try {
                    const o = JSON.parse(text);
                    CACHE.push(o);
                } catch{ e } { }
            });
        });
    });
}

new _JOB('*/5 * * * * *', function () {
    //console.log(new Date().toString());
    if (IS_WRITING || CHANGED.length == 0) {
        IS_WRITING = false;
        return;
    }
}).start();

HTTP.createServer(function (request, response) {
    const method = request.method;
    const url = URL.parse(request.url);
    const query = QUERY_STRING.parse(url.query);
    const api = ((query && query.api) ? query.api : '').toLowerCase();

    if (method != 'POST'
        && api != 'add'
        && api != 'update'
        && api != 'remove'
        && api != 'clean'
        && api != 'search'
        && api != 'list'
        && api != 'schema')
        return responseWrite('', response);

    const body = [];
    request.on('error', (err) => {
        console.error('REQUEST.ERROR: ', err);
    }).on('data', (chunk) => { body.push(chunk); }).on('end', () => {
        try {
            const text = Buffer.concat(body).toString();
            let item;
            if (api == 'add' || api == 'update' || api == 'remove') {
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
            switch (api) {
                case 'add': return add(item, response);
                case 'update': return update(item, response);
                case 'remove': return remove(item, response);
                case 'search': return search(item, response);
                case 'list': return listData(item, response);
                case 'schema': return listSchema(item, response);
                case 'clean': return cacheCleanAll(item, response);
                default: return responseWrite('', response);
            }
        } catch (e) {
            return responseWrite({ Ok: false, Message: 'Occur an error: ' + e.message }, response);
        }
    });
}).listen(PORT, restoreCache);

//console.log(self.cacheBuildNewId({ ___sc: 'comment' }));
//console.log(self.cacheBuildNewId({ ___sc: 'user', UserName: 'thinh' }));
