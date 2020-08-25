
_ioSendMessage = function (pMessage) {
    pMessage = pMessage || {}; pMessage.Id = '*'; if (mIOChannel) { mIOChannel.postMessage(pMessage); }
};
_ioSW_sendMessage = function (pType, pData) {
    _ioSendMessage({ Type: pType, Data: pData });
};
_ioSW_replyMessage = function (pMessage) {
    clients.matchAll({ type: "window" }).then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            //console.log('SW.client = ', client);
            client.postMessage(pMessage);
        }
    });
};
_ioSW_replyData = function (pQueryId, pType, pData) {
    _ioSW_replyMessage({ QueryId: pQueryId, Type: pType, Data: pData })
};

_ioSW_serviceMessageListener = function (event) {
    var m = event.data;
    console.log('@->SW.message = ', m);
    if (m) {
        switch (m.Type) {
            case 'INIT_PORT':
                mIOChannel = event.ports[0];
                break;
            case 'APP.PING_PONG':
                m.Ok = true;
                m.Data = new Date().getTime();
                _ioSW_replyMessage(m);
                break;
            case 'APP.DATA':
                m.Ok = true;
                m.Data = _io_getData();
                _ioSW_replyMessage(m);
                break;
            case 'TAB.INIT_ID':
                m.Ok = true;

                _io_cacheGet('miodata').then(function (res) {
                    if (res.Ok) mIOData.User = res.Data.User;
                    m.Data = _io_getData();
                    _ioSW_replyMessage(m);
                    console.log('SW: ', m.Type);
                });

                break;
            default:
                console.log('SW.Buffers: ' + m.Type, m);
                mIOServiceBuffers.push(m);
                break;
        }
    }
};

_ioSW_seviceReady = async function () {
    mIOSWInited = true;
    console.log('SW: ready ... ');
    console.log('SW.TEST: ', _.filter([1, 2, 3], function (o) { return o % 2 > 0; }));

    var data = _io_getData();
    console.log('UI.data = ', data);
    _ioSW_sendMessage('SW.FIRST_SETUP', data);

    //var m = messageBuild('SW.READY');

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