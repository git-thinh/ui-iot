const channel = new BroadcastChannel('SW_MESSGAE_CHANNEL');

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
    //console.log('SW: onMessageUI = ', m);
    if (m) {
        var type = m.type;
        m.ok = false;

        switch (type) {
            case 'APP.PING_PONG':
                m.ok = true;
                m.data = new Date().getTime();
                senderReplyMessage(m);
                break;
            case 'APP.DATA':
                m.ok = true;
                m.data = DATA;
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
