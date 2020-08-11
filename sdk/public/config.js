mIOData = {
    User: {
        Logined: false,
        Id: null,
        UserName: null,
        Token: null,
        FullName: null,
        ShortName: null,
        Email: null,
        Phone: null,
        Avatar: null
    },
    Setting: {
        App: {

        }
    },
    Resource: {
        Theme: {
            Code: 'dashkit'
        },
        Page: {
            Code: 'login'
        }
    }
};

mIOTest = true;
mIOLocalizeCode = 'en';
mIOKeyAttr = 'io';
mIORootFolder = 'io';
mIOHost = '';

mIOTabArray = [];
mIOServiceBuffers = [];
mIOChannel = new BroadcastChannel('IO_MESSGAE_CHANNEL');

/////////////////////////////////////////////////////////////////////////////

mIOHostClient = location.protocol + '//' + location.host;
switch (location.host) {
    case 'admin.iot.vn':
        mIOSiteCode = 'hiweb';
        break;
}

/////////////////////////////////////////////////////////////////////////////

mIOId = new Date().getTime();
mIOSWInited = false;
mIOFileType = [];
mIOScope = typeof window !== 'undefined' ? 'UI' : 'SW';

_ioMessageBuild = function (pRequestId, pType, pData, pInput) { return { Ok: true, RequestId: pRequestId, Type: pType, Data: pData, Input: pInput }; };
if (mIOScope === 'UI') {
    mIOVarGlobalArray = [];
    mIOIsIE = navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.indexOf("Trident ") > 0;
    mIOUrlSrcSelf = location.href.split('?')[0].split('#')[0];
    mIOSupportServiceWorker = ('serviceWorker' in navigator);

    var uriSDK = new URL(document.currentScript.src);
    mIOHost = uriSDK.protocol + '//' + uriSDK.host;

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
            mIOWorker.postMessage(pMessage);
        });
    };
    _ioUI_sendMessage = function (pType, pData) { return _ioSendMessage({ Type: pType, Input: pData }); };

    _io_commitEvent = IO.commitEvent;
} else {
    mIOHost = V_HOST_GET_FROM_SW;

    _ioSendMessage = function (pMessage) { pMessage = pMessage || {}; pMessage.Id = '*'; if (mIOChannel) { mIOChannel.postMessage(pMessage); } };
    _ioSW_sendMessage = function (pType, pData) { _ioSendMessage({ Type: pType, Data: pData }); };
    _ioSW_replyMessage = function (pMessage) {
        if (pMessage.QueryId) {
            var handle = new BroadcastChannel(pMessage.QueryId + '');
            handle.postMessage(pMessage);
            handle.close();
        }
    };
    _ioSW_replyData = function (pQueryId, pType, pData) { _ioSW_replyMessage({ QueryId: pQueryId, Type: pType, Data: pData }) };
}

/////////////////////////////////////////////////////////////////////////////

switch ((new URL(mIOHost)).host) {
    case 'localhost:8080':
        mIOEnvironment = 'DEV';
        break;
    case 'test.iot.vn':
        mIOEnvironment = 'TEST';
        break;
    default:
        mIOEnvironment = 'RELEASE';
        break;
}

switch (mIOEnvironment) {
    case 'DEV':
        mIOPingPong = false;
        break;
    case 'TEST':
    case 'RELEASE':
        mIOPingPong = true;
        break;
}

console.log('@@@@@ mIOScope = ' + mIOScope + ', mIOEnvironment = ' + mIOEnvironment);

/////////////////////////////////////////////////////////////////////////////

mIOHostPublic = mIOHost + '/public';
mIOHostView = mIOHost + '/' + mIORootFolder;
mIOHostPathJson = mIOHostView + '/sw/' + mIOSiteCode + '/json';

/////////////////////////////////////////////////////////////////////////////



console.log(mIOScope + ': mIOHost = ', mIOHost);
console.log(mIOScope + ': mIOHostView = ', mIOHostView);
console.log(mIOScope + ': mIOSiteCode = ', mIOSiteCode);
console.log(mIOScope + ': mIOHostClient = ', mIOHostClient);
console.log(mIOScope + ': mIOHostPathJson = ', mIOHostPathJson);
