
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

self.addEventListener('install', function (event) {
    console.log('SW.INSTALL: ...');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
    console.log('SW.ACTIVATE: ...1');
    event.waitUntil(self.clients.claim());
});