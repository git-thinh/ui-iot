
var V_HOST_GET_FROM_SW = (new URLSearchParams(location.search)).get('host');
console.log('$ -> SW: V_HOST_GET_FROM_SW = ', V_HOST_GET_FROM_SW);

importScripts(V_HOST_GET_FROM_SW + '/public/io.init.js');

console.log('$ -> SW: importScripts = io.init.js -> done ...');

importScripts(V_HOST_GET_FROM_SW + '/public/global.js');
importScripts(V_HOST_GET_FROM_SW + '/public/global.sw.js');

importScripts(V_HOST_GET_FROM_SW + '/public/lib/filetype.js');
importScripts(V_HOST_GET_FROM_SW + '/public/lib/localforage.min.js');
importScripts(V_HOST_GET_FROM_SW + '/public/lib/lodash.min.js');
importScripts(V_HOST_GET_FROM_SW + '/public/lib/md5.js');
importScripts(V_HOST_GET_FROM_SW + '/public/lib/aes.js');

//---------------------------------------------------------------

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


//---------------------------------------------------------------

self.addEventListener('message', event => {
    _ioSW_serviceMessageListener(event);
});

self.addEventListener('fetch', function (event) {
    //console.log('SW.fetch: @@@ url = ', event.request.url);
    const url = event.request.url;
    if (url.endsWith('/login')) {
        event.respondWith(async function () {
            //const cachedResponse = await caches.match(event.request);
            //if (cachedResponse) return cachedResponse;
            return fetch('/rel/login.html');
        }());
    } else if (url.endsWith('.io')) {
        event.respondWith(async function () {
            var u = new URL(url),
                url2 = '/rel/' + u.pathname.substr(0, u.pathname.length - 3) + '.html';
            var res = await fetch(url2).catch(function (e) {
                var text = '<h1>Cannot find: ' + url2 + '</h1><h3>Error: ' + e.message + '</h3>';
                var resData = new Response(text, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
                return resData;
            });
            return res;
        }());
    } else {
        event.respondWith(
            caches.open('CACHE').then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    //return response || fetch(event.request).then(function (response) {
                    //    cache.put(event.request, response.clone());
                    //    return response;
                    //});

                    if (response) {
                        return response;
                    } else {
                        return fetch(event.request).then(function (response2) {
                            return response2;
                        });
                    }
                });
            })
        );
    }
});

//self.addEventListener('message', _ioSW_serviceMessageListener);

self.addEventListener('install', function (event) {
    console.log('SW.INSTALL: ...');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
    console.log('SW.ACTIVATE: ...1');
    event.waitUntil(self.clients.claim());
    console.log('SW.ACTIVATE: ...2');
    _io_configInit(function () {
        console.log('SW.ACTIVATE: ...3');
        _ioSW_seviceReady();
    });
});

//---------------------------------------------------------------


