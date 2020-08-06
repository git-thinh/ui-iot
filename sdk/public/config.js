mIOData = {
    resource: {
        theme: {},
        page: {}
    }
};

mIOTest = true;
mIOLocalizeCode = 'en';
mIOKeyAttr = 'io';
mIORootFolder = 'io';
mIOHost = '';

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
if (typeof window != 'undefined') {
    mIOScope = 'UI';
    mIOIsIE = navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.indexOf("Trident ") > 0;
    mIOUrlSrcSelf = location.href.split('?')[0].split('#')[0];
    mIOSupportServiceWorker = ('serviceWorker' in navigator);

    var uriSDK = new URL(document.currentScript.src);
    mIOHost = uriSDK.protocol + '//' + uriSDK.host;
} else {
    mIOScope = 'SW';
    mIOHost = V_HOST_GET_FROM_SW;
}

/////////////////////////////////////////////////////////////////////////////

mIOHostPublic = mIOHost + '/public';
mIOHostView = mIOHost + '/' + mIORootFolder;
mIOHostPathJson = mIOHostView + '/sw/' + mIOSiteCode + '/json';

/////////////////////////////////////////////////////////////////////////////

_ioMessageBuild = function (pRequestId, pType, pData, pInput) { return { Ok: true, RequestId: pRequestId, Type: pType, Data: pData, Input: pInput }; };
_ioSendMessage = function (m) { m = m || {}; m.Id = '*'; if (mIOChannel) mIOChannel.postMessage(m); };

console.log(mIOScope + ': mIOHost = ', mIOHost);
console.log(mIOScope + ': mIOHostView = ', mIOHostView);
console.log(mIOScope + ': mIOSiteCode = ', mIOSiteCode);
console.log(mIOScope + ': mIOHostClient = ', mIOHostClient);
console.log(mIOScope + ': mIOHostPathJson = ', mIOHostPathJson);
