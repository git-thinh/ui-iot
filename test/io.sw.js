var V_HOST_GET_FROM_SW = (new URLSearchParams(location.search)).get('host');
importScripts(V_HOST_GET_FROM_SW + '/public/io.init.js');
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

self.addEventListener('fetch', function (event) {
    ////console.log('SW.fetch: @@@ url = ', event.request.url);

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
});

//self.addEventListener('message', _ioSW_serviceMessageListener);

self.addEventListener('install', function (event) {
    console.log('SW.INSTALL: ...');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
    console.log('SW.ACTIVATE: ...');
    event.waitUntil(self.clients.claim());
});

//---------------------------------------------------------------

_io_configInit(function () {
    _ioSW_seviceReady();
});

