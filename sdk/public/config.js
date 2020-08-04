mIOTest = true;
mIOLocalizeCode = 'en';
mIOKeyAttr = 'io';
mIORootFolder = 'views';
mIOData = {};
mIOHost = '';
mIOHostClient = location.host;

switch (mIOHostClient) {
    case 'admin.iot.vn':
        mIOSiteCode = 'hiweb';
        break;
}

mIOId = new Date().getTime();
mIOSWInited = false;
mIOFileType = [];
if (typeof window != 'undefined') {
    mIOIsIE = navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.indexOf("Trident ") > 0;
    mIOUrlSrcSelf = location.href.split('?')[0].split('#')[0];

    var uriSDK = new URL(document.currentScript.src);
    mIOHost = uriSDK.protocol + '//' + uriSDK.host;
    mIOHostPublic = mIOHost + '/public';
    mIOHostView = mIOHost + '/' + mIORootFolder;
    mIOHostPathJson = mIOHostView + '/sw/' + mIOSiteCode + '/json';

    console.log('UI: mIOHost = ', mIOHost);
    console.log('UI: mIOHostView = ', mIOHostView);
    console.log('UI: mIOSiteCode = ', mIOSiteCode);
    console.log('UI: mIOHostClient = ', mIOHostClient);
    console.log('UI: mIOHostPathJson = ', mIOHostPathJson);
}

