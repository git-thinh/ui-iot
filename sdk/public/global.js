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
    mIODebugger = true;
    mIOLocalizeCode = 'en';
    mIOKeyAttr = 'io';
    mIORootFolder = 'io';
    mIOUiPageDefault = 'dashboard';
    mIOHost = '';

    mIOTabArray = [];
    mIOServiceBuffers = [];
    mIOChannel = new BroadcastChannel('IO_MESSGAE_CHANNEL');

    mIOUiComponentArray = [];
    mIOUiTemplate = {};

    _io_vueMixinGlobal = {};
    _io_vueMixinApp = {};
    _io_vueMixinCom = {};

    /////////////////////////////////////////////////////////////////////////////

    mIOHostClient = location.protocol + '//' + location.host;
    switch (location.host) {
        case 'thinh.iot.vn:4431':
            mIOSiteCode = 'hiweb';
            break;
        case 'thinh.iot.vn:4435':
            mIOSiteCode = 'hiweb';
            mIODebugger = false;
            break;
        default:
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

        var uriSDK;
        if (document && document.currentScript) {
            uriSDK = new URL(document.currentScript.src);
            mIOHost = uriSDK.protocol + '//' + uriSDK.host;
        } else {
            var elJs = document.querySelectorAll('script');
            for (var i = 0; i < elJs.length; i++) {
                var src = elJs[i].getAttribute('src');
                if (src && (src.indexOf('/public/io.sdk.js') > 0 || src.indexOf('/public/io.init.js') > 0)) {
                    uriSDK = new URL(src);
                    mIOHost = uriSDK.protocol + '//' + uriSDK.host;
                    break;
                }
            }
        }
        console.log(mIOScope + ': @@@@@ mIOHost = ' + mIOHost);
        if (uriSDK) {
            mIOUiCurrentTheme = uriSDK.searchParams.get('theme');
            mIOUiCurrentPage = uriSDK.searchParams.get('page');
        }

        mIOUiCurrentPage = location.pathname.substr(1);
        if (mIOUiCurrentPage.length === 0) mIOUiCurrentPage = 'index';
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
    mIOHostSite = mIOHostView + '/site/' + mIOSiteCode + '/page';
    mIOHostPathJson = mIOHostView + '/sw/' + mIOSiteCode + '/json';
    mIOHostPathTheme = mIOHostView + '/resource/theme/' + mIOUiCurrentTheme;
    mIOHostPathPage = mIOHostView + '/site/' + mIOSiteCode + '/page/' + mIOUiCurrentPage;

    /////////////////////////////////////////////////////////////////////////////

    console.log(mIOScope + ': mIOHost = ', mIOHost);
    console.log(mIOScope + ': mIOHostView = ', mIOHostView);
    console.log(mIOScope + ': mIOHostSite = ', mIOHostSite);
    console.log(mIOScope + ': mIOSiteCode = ', mIOSiteCode);
    console.log(mIOScope + ': mIOHostClient = ', mIOHostClient);

    console.log(mIOScope + ': mIOUiCurrentTheme = ', mIOUiCurrentTheme);
    console.log(mIOScope + ': mIOUiCurrentPage = ', mIOUiCurrentPage);
    console.log(mIOScope + ': mIOHostPathPage = ', mIOHostPathPage);
    console.log(mIOScope + ': mIOHostPathJson = ', mIOHostPathJson);


    _io_requestGet(mIOHost + '/public/io.init.js', 'text').then(function (pRes) {
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

            var pathname = key.toLowerCase();
            var url = mIOHostClient + '/' + (pathname == 'index' ? '' : pathname);
            const request = new Request(url);

            cache.put(request, resData).then(() => {
                resolve({ Ok: true });
            });
        });
    });
};
_io_cacheGet = function (key) {
    return new Promise((resolve, reject) => {
        caches.open('CACHE').then(function (cache) {
            cache.match('/' + key).then(function (res) {
                if (res) {
                    try {
                        res.json().then(function (data) {
                            resolve({ Ok: true, Data: data });
                        });
                    } catch (e) {
                        resolve({ Ok: false, Message: 'Converting JSON of CACHE.DATA occur error' });
                    }
                } else {
                    resolve({ Ok: false, Message: 'Cannot find CACHE.DATA' });
                }
            }).catch(function () {
                resolve({ Ok: false, Message: 'Cannot find CACHE exist ./miodata' });
            });
        }).catch(function () {
            resolve({ Ok: false, Message: 'Cannot find CACHE' });
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
        if (pCallback) pCallback([]);
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
    if (arr) arr.forEach(function (key) {
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

_io_yyMMddHHmmss = function () {
    const d = new Date();
    const id = d.toISOString().slice(-24).replace(/\D/g, '').slice(2, 8) + '' +
        d.toTimeString().split(' ')[0].replace(/\D/g, '') + '';
    return id;
};

_io_uuid = function () {
    return 'xxxxxxxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

_io_guid = function (schema) {
    schema = schema || '';
    const prefix = (schema.length == 0 ? '' : schema + '|') + ___yyMMddHHmmss() + '|';
    let id = ___uuid();
    return id;
};

_io_convertUnicodeToAscii = function (str) {
    if (str == null || str.length == 0) return '';
    try {
        str = str.trim();
        if (str.length == 0) return '';

        var AccentsMap = [
            "aàảãáạăằẳẵắặâầẩẫấậ",
            "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
            "dđ", "DĐ",
            "eèẻẽéẹêềểễếệ",
            "EÈẺẼÉẸÊỀỂỄẾỆ",
            "iìỉĩíị",
            "IÌỈĨÍỊ",
            "oòỏõóọôồổỗốộơờởỡớợ",
            "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
            "uùủũúụưừửữứự",
            "UÙỦŨÚỤƯỪỬỮỨỰ",
            "yỳỷỹýỵ",
            "YỲỶỸÝỴ"
        ];
        for (var i = 0; i < AccentsMap.length; i++) {
            var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
            var char = AccentsMap[i][0];
            str = str.replace(re, char);
        }

        str = str
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");

        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        str = str.replace(/ + /g, " ");

        str = str.toLowerCase();

    } catch (err_throw) {
        ___log_err_throw('___convert_unicode_to_ascii', err_throw, str);
    }

    return str;
}

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