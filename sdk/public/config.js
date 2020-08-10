mIOData = {
    Setting: {
        App: {

        }
    },
    Resource: {
        Theme: {},
        Page: {}
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

_ioMessageBuild = function (pRequestId, pType, pData, pInput) { return { Ok: true, RequestId: pRequestId, Type: pType, Data: pData, Input: pInput }; };
if (typeof window != 'undefined') {
    mIOVarGlobalArray = [];
    mIOScope = 'UI';
    mIOIsIE = navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.indexOf("Trident ") > 0;
    mIOUrlSrcSelf = location.href.split('?')[0].split('#')[0];
    mIOSupportServiceWorker = ('serviceWorker' in navigator);

    var uriSDK = new URL(document.currentScript.src);
    mIOHost = uriSDK.protocol + '//' + uriSDK.host;

} else {
    mIOScope = 'SW';
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

mIOHostPublic = mIOHost + '/public';
mIOHostView = mIOHost + '/' + mIORootFolder;
mIOHostPathJson = mIOHostView + '/sw/' + mIOSiteCode + '/json';

/////////////////////////////////////////////////////////////////////////////



console.log(mIOScope + ': mIOHost = ', mIOHost);
console.log(mIOScope + ': mIOHostView = ', mIOHostView);
console.log(mIOScope + ': mIOSiteCode = ', mIOSiteCode);
console.log(mIOScope + ': mIOHostClient = ', mIOHostClient);
console.log(mIOScope + ': mIOHostPathJson = ', mIOHostPathJson);
