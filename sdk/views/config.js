mIOKeyAttr = 'io';
mIORootFolder = 'views';

mIOHost = '';
mIOHostClient = location.host;
if (!mIOIsIE) {
    if (typeof window == 'undefined') {
        console.log('SW: mIOHostClient = ', mIOHostClient);
    } else {
        var uriSDK = new URL(document.currentScript.src);
        mIOHost = uriSDK.protocol + '//' + uriSDK.host;
        mIOHostView = mIOHost + '/' + mIORootFolder;
    }
}

switch (mIOHostClient) {
    case 'admin.iot.vn':
        mIOSiteCode = 'hiweb';
        break;
}
