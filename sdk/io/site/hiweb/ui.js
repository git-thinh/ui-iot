function _ioUI_tabInit(pState) {
    console.log('UI._ioUI_tabInit: state = ', pState);
    setInterval(function () { if (mIOPingPong) { _sendAsync('APP.PING_PONG').then(function (val) { }); } }, 1500);
    _ioUI_sendMessage('TAB.INIT_ID', { Id: mIOId, State: pState }).then(function (pMsg) {
        mIOData = pMsg.Data;
        console.log('UI._ioUI_tabInit(): mIOData = ', mIOData);
        if (mIOData.User.Logined) {
            mIOData.Resource.Page.Code = 'dashboard';
        } else {
            mIOData.Resource.Page.Code = 'login';
        }
        setTimeout(IO.goPage, 1);
    });
};

function _ioUI_messageReceived(pMessage) {
    if (pMessage == null) return;
    if (pMessage.Error) { console.error('UI._ioUI_messageReceived: ERROR = ', pMessage); return; }

    var type = pMessage.Type, data = pMessage.Data;

    if (type && data) {
        console.log('-> UI.message: ', type, data);
        switch (type) {
            case 'APP.PING_PONG':
                break;
            case 'SW.FIRST_SETUP':
                _ioUI_tabInit(type, data);
                break;
            default:
                //if (pMessage.type && watcher.hasOwnProperty(pMessage.type)) watcher[pMessage.type](pMessage);
                break;
        }
    }
}
