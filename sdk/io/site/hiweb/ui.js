_ioSendMessage = function (pMessage) {
    if (!mIOSupportServiceWorker) {
        return _sendAsync_fix(type, data);
    }

    if (pMessage.QueryId == null) pMessage.QueryId = new Date().getTime();
    var handler = new BroadcastChannel(pMessage.QueryId + '');
    return new Promise(function (resolve, rej) {
        handler.addEventListener('message', function (event) {
            var m = event.data;
            if (m.type != 'APP.PING_PONG') {
                if (m.error) {
                    console.error('UI.message_received = ', m);
                    return;
                }
                else {
                    console.log('UI._sendAsync = ', m);
                }
            }

            if (m.type == 'APP.LOGIN') {
                if (m.ok && m.data) localStorage.setItem('USER', JSON.stringify(m.data));
                setTimeout(function (m_) { resolve(m_); }, 500, m);
            } else if (m.type == 'APP.LOGIN') {
                if (m.ok) localStorage.removeItem('USER');
                setTimeout(function (m_) { resolve(m_); }, 500, m);
            } else resolve(m);

            //if (m.close == true) handler.close();
        });
        mWorker.postMessage(m);
    });
};

_io_commitEvent = IO.commitEvent;

function _ioUI_tabInit(pState, pData) {
    console.log('UI._ioUI_tabInit: state = ', pState, pData);
    //setInterval(function () {
    //    _sendAsync('APP.PING_PONG').then(function (val) {
    //        //console.log('$$$$$$$$ APP.PING_PONG = ', val.data);
    //        console.log('PING_PONG');
    //    });
    //}, 1500);

    var data;
    switch (pState) {
        case 'SW.FIRST_SETUP':
            console.log('UI: TAB.INIT_ID_ONLY = ', mIOId);
            _ioUI_sendMessage('TAB.INIT_ID_ONLY', mIOId);
            _io_commitEvent('TAB.READY', pData)
            break;
        case 'SW.ACTIVE':
            console.log('UI: TAB.INIT_ID_GET_DATA = ', mIOId);
            _ioUI_sendMessage('TAB.INIT_ID_GET_DATA', mIOId);
            break;
    }

    //_ioUI_sendMessage('APP.TAB_INIT', { apiHost: API_HOST, wsHostPath: WS_HOST_PATH }).then(function (DATA_) {
    //    _ready(DATA_, function (VAL_) {
    //        if (watcher['APP.TAB_INIT']) watcher['APP.TAB_INIT'](VAL_);
    //    });
    //});
};

function _ioUI_messageReceived(pMessage) {
    if (pMessage == null) return;

    var type = pMessage.Type, data = pMessage.Data;
    console.log('-> UI.message: ', type, data);
    switch (type) {
        case 'SW.FIRST_SETUP':
            _ioUI_tabInit(type, data);
            break;
    }

    ////if (pMessage.type != 'APP.PING_PONG') {
    ////    if (pMessage.error) {
    ////        console.error('UI.message_received = ', pMessage);
    ////        return;
    ////    }
    ////    //else console.log('UI.message_received = ', pMessage);
    ////}

    ////var valid = pMessage.id == mId || pMessage.id == '*';
    ////if (!valid) {
    ////    // Check type CHAT_BOX must be valid ticketId is showing ...
    ////}
    ////if (valid && pMessage.type && watcher.hasOwnProperty(pMessage.type)) watcher[pMessage.type](pMessage);
}
