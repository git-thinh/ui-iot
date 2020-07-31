function responseFetch(pQueryId, pRequest, pMethod, pUrl, pResultTypeJsonOrText) {
    return new Promise(function (resolve) {
        pRequest.then(function (r) {
            if (!r.ok) {
                return { Ok: false, Code: r.status, Error: 'HTTP status ' + r.status, Data: r.statusText };
            }
            return r.text();
        }).then(function (v) {
            var result;
            var type = typeof v;

            if (type == 'string') {
                if (pResultTypeJsonOrText == 'json') {
                    if (v.length > 1 && (v[0] == '{' || v[0] == '[')) {
                        try {
                            var data = JSON.parse(v);
                            result = { Ok: true, Code: 200, Data: data, Type: 'json' };
                        } catch (e1) {
                            result = { Ok: false, 1: -1, Error: 'Error convert JSON of response: ' + e1.message, Text: v };
                            //result = { Ok: true, Code: 200, Data: v, Type: 'text' };
                        }
                    } else if (v.length > 0) {
                        result = { Ok: true, Code: 200, Data: v, Type: 'text' };
                    } else {
                        result = { Ok: false, Code: -2, Data: v, Error: 'Response is empty' };
                    }
                } else {
                    result = { Ok: true, Code: 200, Data: v, Type: 'text' };
                }
            } else {
                if (v && v.Ok != null && v.Code != null) {
                    result = v;
                } else {
                    result = { Ok: false, Data: v, Code: -3, Error: 'Response must be format { Ok:..., CodeL ..., Data:..., Error: ...}' };
                }
            }

            result.QueryId = pQueryId;
            result.Url = pUrl;
            result.Method = pMethod;
            resolve(result);
        });
    });
}
function requestFetch(pQueryId, pMethod, pUrl, pData, pHeaders, pResultTypeJsonOrText) {
    pResultTypeJsonOrText = pResultTypeJsonOrText || 'json';

    pMethod = pMethod || 'GET';
    pHeaders = pHeaders || {};

    //console.log(pUrl, pHeaders);

    var request;
    if (pData) {
        request = fetch(pUrl, {
            pMethod: pMethod,
            headers: pHeaders,
            body: JSON.stringify(pData)
        });
    } else {
        request = fetch(pUrl, {
            method: pMethod,
            headers: pHeaders
        });
    }

    return responseFetch(pQueryId, request, pMethod, pUrl, pResultTypeJsonOrText);
}
function requestGet(pUrl, pResultTypeJsonOrText) {
    return requestFetch(0, 'GET', pUrl, null, null, pResultTypeJsonOrText);
}

//////////////////////////////////////////////////////////////////////////

var mIOId = new Date().getTime(), mIOSWInited = false,
    mIOIsIE = navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.indexOf("Trident ") > 0,
    mIOUrlSrcSelf = location.href.split('?')[0].split('#')[0],
    mIOKeyAttr, mIOSiteCode, mIORootFolder = 'views',
    mIOHostClient, mIOHost, mIOHostView, mIOFileType = [];

var uriSwPara = new URLSearchParams(location.search);
mIOHost = uriSwPara.get('host');
mIOHostView = mIOHost + '/' + mIORootFolder;
console.log('SW: mIOHost = ', mIOHost);
console.log('SW: mIOHostView = ', mIOHostView);

var urlConfig = mIOHostView + '/config.js';
console.log('SW: urlConfig = ', urlConfig);
fetch(urlConfig).then(function (r) { return r.text(); }).then(function (js) { eval(js); seviceInstall(); });

//////////////////////////////////////////////////////////////////////////

function seviceInstall() {
    console.log('SW: ok = ', urlConfig);
    console.log('SW: install ... ');
    console.log('SW: mIOSiteCode = ', mIOSiteCode);
    console.log('SW: mIOHostClient = ', mIOHostClient);
    console.log('SW: mIOHostView = ', mIOHostView);

    var jsArray = [];
    jsArray.push(mIOHostView + '/lib/lodash.min.js');
    jsArray.push(mIOHostView + '/sw/file-type.js');
    jsArray.push(mIOHostView + '/sw/global.js');
    jsArray.push(mIOHostView + '/sw/websocket.js');
    jsArray.push(mIOHostView + '/sw/' + mIOSiteCode + '/_global.js');
    jsArray.push(mIOHostView + '/sw/' + mIOSiteCode + '/api.js');
    jsArray.push(mIOHostView + '/sw/' + mIOSiteCode + '/mapper.js');
    jsArray.push(mIOHostView + '/sw/' + mIOSiteCode + '/interface.js');
    jsArray.push(mIOHostView + '/sw/' + mIOSiteCode + '/hook.js');
    //console.log('SW.JS_ARRAY = ', jsArray);
    var proArray = [];
    jsArray.forEach(function (url) { proArray.push(requestGet(url, 'text')); });
    Promise.all(proArray).then(function (rsArray) {
        rsArray.forEach(function (r, index) {
            if (r.Ok) {
                eval(r.Data);
                console.log('SW: ok = ', r.Url);
            } else {
                console.log('SW: fail = ', r.Url);
            }
            if (index == jsArray.length - 1) {
                setTimeout(function () {
                    console.log('SW: ok all ' + jsArray.length + ' url');
                    seviceReady();
                }, 1);
            }
        })
    })
}


function seviceReady() {
    mIOSWInited = true;
    console.log('SW: ready ... ');
    console.log('SW.TEST: ', _.filter([1, 2, 3], function (o) { return o % 2 > 0; }));
}

//////////////////////////////////////////////////////////////////////////

const channel = new BroadcastChannel('SW_MESSGAE_CHANNEL');
function serviceBroadcast(m) { m = m || {}; m.Id = '*'; channel.postMessage(m); }

//////////////////////////////////////////////////////////////////////////

//JS_ARRAY.forEach(function (url) { importScripts(url); });

//////////////////////////////////////////////////////////////////////////

self.addEventListener('message', onMessageUI);

self.addEventListener('install', function (event) {
    console.log('SW.INSTALL: ' + location.host + ' ...');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
    console.log('SW.ACTIVATE: ' + location.host + ' ...');
    event.waitUntil(self.clients.claim());
});

async function onMessageUI(event) {
    var m = event.data;
    if (m) {
        var type = m.type;
        switch (type) {
            case 'APP.PING_PONG':
                m.ok = true;
                m.data = new Date().getTime();
                senderReplyMessage(m);
                break;
            default:
                console.log('SW: ' + type + ' -> ', m.input);
                var fun = type.toLowerCase().split('.').join('___');
                if (typeof self[fun] == 'function') {
                    setTimeout(function (o) { self[fun](o); }, 1, m);
                } else {
                    m.error = type + ': Cannot find function ' + fun + '(m) to call';
                }
                break;
        }
    }
}
