
function headerBuild(pHeader) {
    var header = pHeader || {};
    return header;
};
function replyMessageToUI(pMessage) {
    if (pMessage && pMessage.QueryId) {
        var sender = new BroadcastChannel(pMessage.QueryId);
        sender.postMessage(pMessage);
        sender.close();
    }
}
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
    pHeaders = headerBuild(pHeaders);

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


//////////////////////////////////////////////////////////////////////////
var MD5, CryptoJS;
//////////////////////////////////////////////////////////////////////////

var uriTargetPara_ = new URLSearchParams(location.search);
var host_ = uriTargetPara_.get('host'),
    urlInitJs_ = host_ + '/public/init.js',
    urlConfigJs_ = host_ + '/public/config.js';
(async function () {
    const rInit = await fetch(urlInitJs_, { mode: 'cors' });
    const jsInit = await rInit.text();
    //console.log(urlInitJs_, jsInit);
    jsInit.trim().substr(4).split(',').forEach(function (v) {
        v = v.trim();
        if (v.endsWith(';')) v = v.substr(0, v.length - 1);
        //console.log('SW.INIT: ', v);
        self[v] = null;
    });

    const rConfig = await fetch(urlConfigJs_, { mode: 'cors' });
    const jsConfig = await rConfig.text();
    //console.log(urlConfigJs_, jsConfig);
    eval('var V_HOST_GET_FROM_SW = "' + host_ + '"; ' + jsConfig);

    seviceInstall(); 
})();



function seviceInstall() {
    console.log('SW: install ... ');

    var jsArray = [];
    jsArray.push(mIOHostView + '/lib/md5.js');
    jsArray.push(mIOHostView + '/lib/aes.js');
    jsArray.push(mIOHostView + '/lib/lodash.min.js');
    jsArray.push(mIOHostView + '/lib/filetype.js');
    jsArray.push(mIOHostView + '/site/global.js');
    jsArray.push(mIOHostView + '/site/ws.js');
    jsArray.push(mIOHostView + '/site/' + mIOSiteCode + '/_global.js');
    jsArray.push(mIOHostView + '/site/' + mIOSiteCode + '/api.js');
    jsArray.push(mIOHostView + '/site/' + mIOSiteCode + '/mapper.js');
    jsArray.push(mIOHostView + '/site/' + mIOSiteCode + '/interface.js');

    if (mIOTest) jsArray.push(mIOHostView + '/site/' + mIOSiteCode + '/test.js');

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

async function seviceReady() {
    mIOSWInited = true;
    console.log('SW: ready ... ');
    console.log('SW.TEST: ', _.filter([1, 2, 3], function (o) { return o % 2 > 0; }));
    var m = messageBuild('SW.READY');

    //////var myString = "blablabla Card game bla";
    //////var myPassword = "myPassword";
    //////var encrypted = CryptoJS.AES.encrypt(myString, myPassword);
    //////var decryptedBuf = CryptoJS.AES.decrypt(encrypted, myPassword);
    //////var decrypted = decryptedBuf.toString(CryptoJS.enc.Utf8);
    //////console.log(`${decrypted} = ${encrypted}`)

    //////var md5 = MD5('123456');
    //////console.log(md5);

    //const response = await fetch(`${mIOHostPathJson}/users.json`, { mode: 'cors' });
    //const blob = await response.blob();
    //console.log(blob);
    //// Use the in-memory cache instead of cache storage, because the Blob URL expires once the page is closed
    //const headers = new Headers({
    //    'Content-Type': 'application/json; charset=utf-8',
    //    'Expires': (new Date(Date.now())).toUTCString(),
    //    'Cache-Control': 'no-store'
    //});
    //var res = new Response(blob, { status: 200, statusText: 'OK', headers });

    //caches.open('CACHE').then(function (cache) {
    //    //var resData = new Response(JSON.stringify(DATA), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
    //    cache.put('users.json', res).then(function () {
    //        console.log('????????????');
    //    });
    //});
}

function serviceExecute() {
    if (mIOSWInited) {
        if (mIOServiceBuffers.length > 0) {
            var m = mIOServiceBuffers.shift();
            if (m) {
                var type = m.Type;
                console.log('SW.Execute: ' + type, m);
                var fun = type.toLowerCase().split('.').join('___');
                if (typeof self[fun] == 'function') {
                    setTimeout(function (o) { self[fun](o); }, 1, m);
                } else {
                    m.Ok = false;
                    m.Error = type + ': Cannot find function ' + fun + '(m) to call';
                    setTimeout(function (o) { replyMessageToUI(o); }, 1, m);
                }
            }

            if (mIOServiceBuffers.length > 0) serviceExecute();
            else setTimeout(function () { serviceExecute(); }, 1000);
        } else setTimeout(function () { serviceExecute(); }, 1000);
    } else setTimeout(function () { serviceExecute(); }, 1000);
}


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

//////////////////////////////////////////////////////////////////////////

function onMessageUI(event) {
    var m = event.data;
    if (m) {
        switch (m.Type) {
            case 'APP.PING_PONG':
                m.Ok = true;
                m.Data = new Date().getTime();
                senderReplyMessage(m);
                break;
            default:
                console.log('SW.Buffers: ' + m.Type, m);
                mIOServiceBuffers.push(m);
                break;
        }
    }
}
