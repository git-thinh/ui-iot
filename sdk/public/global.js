_io_configInit = function (pCallback) {
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
        },
        Render: {
            Page: {
                Visible: false
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

    _io_vueMixinGlobal = {};
    _io_vueMixinApp = {};
    _io_vueMixinCom = {};

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

    if (mIOScope === 'UI') {
        mIOVarGlobalArray = [];
        mIOIsIE = navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.indexOf("Trident ") > 0;
        mIOUrlSrcSelf = location.href.split('?')[0].split('#')[0];
        mIOSupportServiceWorker = ('serviceWorker' in navigator);

        //var uriSDK = new URL(document.currentScript.src);
        //mIOHost = uriSDK.protocol + '//' + uriSDK.host;
        var uriSDK;
        var elJs = document.querySelectorAll('script');
        for (var i = 0; i < elJs.length; i++) {
            var src = elJs[i].getAttribute('src');
            if (src && src.indexOf('/public/io.sdk.js') > 0) {
                console.log(mIOScope + ': @@@@@ ' + src);
                uriSDK = new URL(src);
                mIOHost = uriSDK.protocol + '//' + uriSDK.host;
                break;
            }
        }
        if (uriSDK) {
            mIOUiCurrentTheme = uriSDK.searchParams.get('theme');
            mIOUiCurrentPage = uriSDK.searchParams.get('page');
        }
    } else {
        mIOHost = V_HOST_GET_FROM_SW;
        mIOChannel.addEventListener('message', _ioSW_serviceMessageListener);
    }

    /////////////////////////////////////////////////////////////////////////////

    //switch ((new URL(mIOHost)).host) {
    //    case 'localhost:8080':
    //        mIOEnvironment = 'DEV';
    //        break;
    //    case 'test.iot.vn':
    //        mIOEnvironment = 'TEST';
    //        break;
    //    default:
    //        mIOEnvironment = 'RELEASE';
    //        break;
    //}
    mIOEnvironment = 'DEV';

    switch (mIOEnvironment) {
        case 'DEV':
            mIOPingPong = false;
            break;
        case 'TEST':
        case 'RELEASE':
            mIOPingPong = true;
            break;
    }

    console.log(mIOScope + ': @@@@@ mIOScope = ' + mIOScope + ', mIOEnvironment = ' + mIOEnvironment);

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

    console.log(mIOScope + ': mIOUiCurrentTheme = ', mIOUiCurrentTheme);
    console.log(mIOScope + ': mIOUiCurrentPage = ', mIOUiCurrentPage);

    _io_requestGet(mIOHost + '/public/init.js', 'text').then(function (pRes) {
        if (pRes.Ok) {
            mIOVarGlobalArray = [];
            pRes.Data.trim().substr(4).split(',').forEach(function (v) {
                v = v.trim();
                if (v.endsWith(';')) v = v.substr(0, v.length - 1);
                //console.log('SW.INIT: ', v);
                mIOVarGlobalArray.push(v);
            });
        }

        if (pCallback) pCallback();
    });
};

_io_cacheUpdate = function (key, data, contentType) {
    return new Promise((resolve, reject) => {
        caches.open('CACHE').then(function (cache) {
            var text = typeof data === 'string' ? data : JSON.stringify(data);
            var resData = new Response(text, { headers: { 'Content-Type': contentType + '; charset=utf-8' } });
            const request = new Request('/' + key);
            cache.put(request, resData).then(() => {
                resolve({ Ok: true });
            });
        });
    });
};

_io_responseFetch = function (pQueryId, pRequest, pMethod, pUrl, pResultTypeJsonOrText) {
    return new Promise(function (resolve) {
        pRequest.then(function (r) {
            if (!r.ok) {
                return { Ok: false, Code: r.status, Error: 'HTTP status ' + r.status, Data: r.statusText };
            }
            return r.text();
        }).then(function (v) {
            var result;
            var type = typeof v;

            if (type == 'string') {
                if (pResultTypeJsonOrText == 'json') {
                    if (v.length > 1 && (v[0] == '{' || v[0] == '[')) {
                        try {
                            var data = JSON.parse(v);
                            result = { Ok: true, Code: 200, Data: data, Type: 'json' };
                        } catch (e1) {
                            result = { Ok: false, 1: -1, Error: 'Error convert JSON of response: ' + e1.message, Text: v };
                            //result = { Ok: true, Code: 200, Data: v, Type: 'text' };
                        }
                    } else if (v.length > 0) {
                        result = { Ok: true, Code: 200, Data: v, Type: 'text' };
                    } else {
                        result = { Ok: false, Code: -2, Data: v, Error: 'Response is empty' };
                    }
                } else {
                    result = { Ok: true, Code: 200, Data: v, Type: 'text' };
                }
            } else {
                if (v && v.Ok != null && v.Code != null) {
                    result = v;
                } else {
                    result = { Ok: false, Data: v, Code: -3, Error: 'Response must be format { Ok:..., CodeL ..., Data:..., Error: ...}' };
                }
            }

            result.QueryId = pQueryId;
            result.Url = pUrl;
            result.Method = pMethod;
            resolve(result);
        });
    });
};

_io_requestFetch = function (pQueryId, pMethod, pUrl, pData, pHeaders, pResultTypeJsonOrText) {
    pResultTypeJsonOrText = pResultTypeJsonOrText || 'json';

    pMethod = pMethod || 'GET';
    pHeaders = pHeaders || {};

    //console.log(pUrl, pHeaders);

    var request;
    if (pData) {
        request = fetch(pUrl, {
            pMethod: pMethod,
            headers: pHeaders,
            body: JSON.stringify(pData)
        });
    } else {
        request = fetch(pUrl, {
            method: pMethod,
            headers: pHeaders
        });
    }

    return _io_responseFetch(pQueryId, request, pMethod, pUrl, pResultTypeJsonOrText);
};

_io_requestGet = function (pUrl, pResultTypeJsonOrText) {
    return _io_requestFetch(0, 'GET', pUrl, null, null, pResultTypeJsonOrText);
};

_io_requestGetArray = function (pUrlArray, pResultTypeArray, pCallback) {
    if (pUrlArray && Array.isArray(pUrlArray) && pUrlArray.length > 0) {
        pResultTypeArray = pResultTypeArray || [];
        if (pResultTypeArray.length == 0) pResultTypeArray = pUrlArray.map(function () { return 'text'; });

        var arrPro = pUrlArray.map(function (url, index) {
            return _io_requestGet(url, pResultTypeArray[index]);
        });
        Promise.all(arrPro).then(function (rValArray) {
            if (pCallback) pCallback(rValArray);
        });
    } else {
        if (!valid && pCallback) pCallback([]);
    }
};


//----------------------------------------------------------------------------------------

_io_getData = function () {
    var settingApp = _io_getSettingApp();
    mIOData.Setting.App = settingApp;
    return mIOData;
}

_io_getSettingApp = function () {
    var arr = [], _self;
    if (typeof window == "undefined") _self = self; else _self = window;
    arr = _self['mIOVarGlobalArray'];
    var obj = {};
    arr.forEach(function (key) {
        if (key[0] != '_' &&
            key != 'mIOData' &&
            key != 'mIOWorker' &&
            key != 'mIOChannel') {
            obj[key] = _self[key];
        }
    });
    return obj;
}


//----------------------------------------------------------------------------------------

_ioMessageBuild = function (pRequestId, pType, pData, pInput) {
    return { Ok: true, RequestId: pRequestId, Type: pType, Data: pData, Input: pInput };
};

//----------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------

var getParameterByName = function (name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

function numberToByteArray(number, size) {
    size = size || 8;
    var byteArray = [];
    for (var i = 0; i < size; i++) byteArray.push(0);

    for (var index = 0; index < byteArray.length; index++) {
        var byte = number & 0xff;
        byteArray[index] = byte;
        number = (number - byte) / 256;
    }

    return byteArray;
};

function byteArrayToLong(/*byte[]*/byteArray) {
    var value = 0;
    for (var i = byteArray.length - 1; i >= 0; i--) {
        value = (value * 256) + byteArray[i];
    }
    return value;
};