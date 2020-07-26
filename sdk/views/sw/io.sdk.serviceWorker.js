
self.addEventListener('install', function (event) {
    console.log('SW.INSTALL: ' + location.host + ' ...');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
    console.log('SW.ACTIVATE: ' + location.host + ' ...');
    event.waitUntil(self.clients.claim());
});