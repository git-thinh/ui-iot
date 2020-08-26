
_ioUI_messageReceived = function (pMessage) {
    //console.log('@-> UI.message: ', pMessage);

    if (pMessage === null) return;
    if (pMessage.Error) { console.error('UI._ioUI_messageReceived: ERROR = ', pMessage); return; }

    if (mIOReplyIds[pMessage.QueryId]) {
        var po = mIOReplyIds[pMessage.QueryId];
        po(pMessage);
        delete mIOReplyIds[pMessage.QueryId];
        return;
    }

    var type = pMessage.Type, data = pMessage.Data;

    if (type && data) {
        //console.log('-> UI.message: ', type, data);
        switch (type) {
            case 'APP.PING_PONG':
                break;
            case 'SW.FIRST_SETUP':
                _ioUI_firstSetupServiceWorkerCallback(type, data);
                break;
            default:
                //if (pMessage.type && watcher.hasOwnProperty(pMessage.type)) watcher[pMessage.type](pMessage);
                break;
        }
    }
}

_ioSendMessage = function (pMessage) {
    if (!mIOSupportServiceWorker) {
        return _sendAsync_fix(type, data);
    }

    if (pMessage.QueryId === null) pMessage.QueryId = new Date().getTime();

    return new Promise(function (resolve, rej) {
        mIOReplyIds[pMessage.QueryId] = resolve;
        mIOWorker.postMessage(pMessage);
    });
};

_ioUI_sendMessage = function (pType, pData) {
    return _ioSendMessage({ Type: pType, Input: pData });
};

//----------------------------------------------------------------------------------------

_ioUI_linkCssInsertHeader = function (pUrl) {
    if (pUrl) {
        var link = document.createElement('link');
        link.setAttribute('href', pUrl);
        link.setAttribute('rel', 'stylesheet');
        document.head.appendChild(link);
    }
}
_ioUI_linkCssInsertHeaderArray = function (pUrls) {
    if (pUrls && Array.isArray(pUrls)) {
        pUrls.forEach(function (url) { _ioUI_linkCssInsertHeader(url); });
    }
}

_ioUI_scriptInsertHeader = function (url, pCallback, id) {
    var valid = false;
    if (url && url.length > 0) {
        var key = url.toLowerCase();
        valid = true;
        //console.log(url);
        var script = document.createElement('script');
        script.onload = function () {
            if (pCallback) pCallback({ Id: id, Ok: true, Url: url });
        };
        script.setAttribute('src', url);
        if (id) script.setAttribute('id', id);
        document.head.appendChild(script);
    }
    if (!valid && pCallback) pCallback({ Ok: false, Url: url });
}
_ioUI_scriptInsertHeaderArray = function (pUrlArray, pCallback, pIdArray) {
    if (pUrlArray && Array.isArray(pUrlArray) && pUrlArray.length > 0) {
        var arrPro = [];
        pUrlArray.forEach(function (url, index) {
            var pro = new Promise(function (resolve, rejected) {
                var id;
                if (pIdArray && pIdArray.length > index) id = pIdArray[index];
                _ioUI_scriptInsertHeader(url, function (rVal) {
                    resolve(rVal);
                }, id);
            });
            arrPro.push(pro);
        });
        Promise.all(arrPro).then(function (rValArray) {
            if (pCallback) pCallback(rValArray);
        });
    } else {
        if (pCallback) pCallback([]);
    }
};

//----------------------------------------------------------------------------------------

_ioUI_vueInstall = function (pCallback) {
    _io_requestGetArray([mIOHost + '/io/list.json', mIOHostSite + '/menu.json'], ['json', 'json'], function (resArr) {
        //console.log('_ioUI_vueInstall: ', res);
        mIOUiMenu = {};
        mIOUiComponentArray = [];
        if (resArr[0].Ok) mIOUiComponentArray = resArr[0].Data;
        if (resArr[1].Ok) mIOUiMenu = resArr[1].Data;

        var jss = [], temps = [], keys = [];
        mIOUiComponentArray.forEach(function (o) {
            keys.push(o.Key);
            var path = mIOHostView + '/' + o.Root + '/' + o.Scope + '/' + o.Name + '/';
            if (o.Files.length > 0 && _.findIndex(o.Files, function (x) { return x == 'controller.js'; }) != -1)
                jss.push(path + 'controller.js');

            if (o.Files.length > 0 && _.findIndex(o.Files, function (x) { return x == 'temp.htm'; }) != -1)
                temps.push(path + 'temp.htm');

            if (o.Files.length > 0 && _.findIndex(o.Files, function (x) { return x == 'style.css'; }) != -1)
                _ioUI_linkCssInsertHeader(path + 'style.css');
            //console.log('_ioUI_vueInstall: ', o.Key, path);
        });

        var k1 = _.map(_.filter(mIOUiComponentArray, function (x) {
            return x.Files != null && x.Files.length > 0 &&
                _.findIndex(x.Files, function (x1) { return x1 == 'controller.js'; }) != -1;
        }), function (x2) { return x2.Key; });
        //.log(k1);
        var k2 = _.map(_.filter(mIOUiComponentArray, function (x) {
            return x.Files != null && x.Files.length > 0 &&
                _.findIndex(x.Files, function (x1) { return x1 == 'temp.htm'; }) != -1;
        }), function (x2) { return x2.Key; });
        //console.log(k2);
        var jsMiss = _.differenceBy(k2, k1);
        //console.log(k3);

        //console.log(jss);
        //console.log(temps);
        _io_requestGetArray(temps, null, function (rsArr1) {
            //console.log(rsArr1);
            rsArr1.forEach(function (r1) {
                var key = null, a = (r1.Url || '').split('/');
                if (a.length > 3) key = a[a.length - 4] + '_' + a[a.length - 3] + '_' + a[a.length - 2];
                if (key) {
                    if (r1.Ok) mIOUiTemplate[key] = r1.Data;
                    else mIOUiTemplate[key] = '<div></div>';
                }
            });
            //console.log(mIOUiTemplate);
        });

        _io_requestGetArray(jss, null, function (rsArr2) {
            //console.log(rsArr2);
            var jsAll = '';
            //console.log(JSON.parse(JSON.stringify(keys)));

            rsArr2.forEach(function (r2) {
                var key = null, a = (r2.Url || '').split('/');
                if (a.length > 3) key = a[a.length - 4] + '_' + a[a.length - 3] + '_' + a[a.length - 2];
                if (key) {
                    var js = '';
                    if (r2.Ok) js = r2.Data.trim();
                    if (js.length < 2) js = "{}";
                    js = js.substr(1, js.length - 2);
                    //console.log(js);

                    js = 'var ' + key + ' = Vue.component("' + key + '", { \r\n'
                        + '   mixins: [_ioUI_vueMixinCom], \r\n'
                        + '   template: mIOUiTemplate["' + key + '"], \r\n'
                        + js
                        + '\r\n});';

                    jsAll += '\r\n\r\n' + js + '\r\n\r\n';
                }
            });

            jsMiss.forEach(function (key) {
                var js = 'var ' + key + ' = Vue.component("' + key + '", { \r\n'
                    + '   mixins: [_ioUI_vueMixinCom], \r\n'
                    + '   template: mIOUiTemplate["' + key + '"], \r\n'
                    + '\r\n});';
                jsAll += '\r\n\r\n' + js + '\r\n\r\n';
            });

            const blob = new Blob([jsAll], { type: 'text/javascript' });
            const urlComponentJS = URL.createObjectURL(blob)

            //_io_cacheUpdate('io.components.js', jsAll, 'text/javascript').then(function () {
            //_ioUI_scriptInsertHeader(mIOHostClient + '/io.components.js', function () {
            _ioUI_scriptInsertHeader(urlComponentJS, function () {
                //console.log('_ioUI_vueInstall: done = ', keys, jsMiss);
                console.log('_ioUI_vueInstall: done = ', keys);
                if (pCallback) return pCallback();
            });
            //});
        });
    });
};

_ioUI_vueRenderBodyClass = function () {
    return ' ' + mIOKeyAttr + '-theme-' + mIOData.Resource.Theme.Code +
        ' ' + mIOKeyAttr + '-page-' + mIOData.Resource.Page.Code;
}

_ioUI_commitEvent = function (pKey, pFunction) { }

_ioUI_menuGo = function (menu) {
    var info = _ioUI_pageGetInfo(menu);
    console.log('_ioUI_menuGo: ', menu);
    switch (info.Type) {
        case 'main_site':
            _ioUI_pageGo(menu);
            break;
        case 'main_iframe':
            break;
        case 'popup':
            break;
        case 'popup_iframe':
            break;
        default:
            var func = info.Type;
            if (func && typeof window[func] === 'function') {
                window[func]();
            }
            break;
    }
};

//----------------------------------------------------------------------------------------

_ioUI_firstSetupServiceWorkerCallback = function (pType, pData) {
    console.log(mIOScope + '._ioUI_firstSetupServiceWorkerCallback: data = ', pData);
    _ioUI_pageGo();
};

_ioUI_tabInit = function () {
    console.log('UI._ioUI_tabInit ... ');
    //setInterval(function () { if (mIOPingPong) { _sendAsync('APP.PING_PONG').then(function (val) { }); } }, 1500);

    _ioUI_sendMessage('TAB.INIT_ID').then(function (pMsg) {
        mIOData = pMsg.Data;
        console.log('UI._ioUI_tabInit: -> TAB.INIT_ID : mIOData.User.Logined = ', mIOData.User.Logined);
        //debugger;
        _ioUI_pageGo();
    });
};

_ioUI_pageCheckLogin = function (pCallback) {
    if (!mIOData.User.Logined && location.pathname != '/login') {
        _io_cacheExist('login').then(function (exist) {
            if (exist) {
                if (pCallback) pCallback(true);
            } else {
                _ioUI_pageInstall('login', function () {
                    if (pCallback) pCallback(true);
                })
            }
        });
    } else if (pCallback) pCallback(false);
};

_ioUI_pageGo = function (pCode) {
    _ioUI_pageCheckLogin(function (login) {
        if (login) {
            if (mIODebugger) debugger;
            return location.href = '/login';
        }

        var page = pCode;
        if (page == null || page.length == 0) page = location.pathname.substr(1).toLowerCase();
        if (page.length == 0) page = 'index';

        var pageId = mIOKeyAttr + '-page-' + page;
        console.log('UI._ioUI_pageGo: ', page, pageId);
        _io_cacheExist(page).then(function (exist) {
            if (exist) {
                if (window[pageId]) {

                    if (_ioUI_vueApp && _ioUI_vueApp.___page == page) {
                        if (mIODebugger) debugger;
                        return location.reload();
                    }

                    if (mIODebugger) debugger;

                    mIOUiCurrentPage = page;
                    _ioUI_vueApp = window[pageId]();
                    _ioUI_vueApp.___page = page;
                    return;
                }
            }

            _ioUI_pageInstall(page, function () {
                if (mIODebugger) debugger;
                location.href = '/' + (page === 'index' ? '' : page);
            });
        });
    });
}

_ioUI_pageGetInfo = function (page) {
    var info = {};
    if (mIOUiMenu && mIOUiMenu.menus && mIOUiMenu.menus[page])
        info = mIOUiMenu.menus[page];
    //console.log('UI._ioUI_pageGetInfo: ' + page + ' = ', info);
    return info;
};

_ioUI_pageInstall = function (pCode, pCallback) {
    var page = pCode.toLowerCase(),
        info = _ioUI_pageGetInfo(page),
        templateName = info.Template || '',
        widgetMain = '';
    if (templateName.indexOf('.') > 0) {
        var a = templateName.split('.');
        templateName = a[0];
        widgetMain = a[1];
    }
    console.log('UI._ioUI_pageInstall: ' + page, templateName, widgetMain);
    if (templateName.length == 0) {
        console.error('UI._ioUI_pageInstall: Cannot find template: ' + templateName + ' of page: ' + page, info);
        return;
    }

    var theme = mIOData.Resource.Theme.Code,
        noCacheId = '___=' + new Date().getTime(),
        urlThemeTemplate = mIOHostView + '/resource/theme/' + theme + '/' + templateName + '.htm?' + noCacheId,
        urlPageJs = mIOHostView + '/site/' + mIOSiteCode + '/page/' + page + '/app.js?' + noCacheId,
        urlPageCss = mIOHostView + '/site/' + mIOSiteCode + '/page/' + page + '/style.css?' + noCacheId,
        urlPageTemplate = mIOHostView + '/site/' + mIOSiteCode + '/page/' + page + '/temp.htm?' + noCacheId,
        urlSdk = mIOHost + '/public/io.sdk.js?' + noCacheId + '&theme=' + theme + '&page=' + page;

    console.log('UI.theme = ', urlThemeTemplate);
    console.log('UI.page = ', urlPageTemplate);

    //debugger

    _io_requestGetArray([urlThemeTemplate, urlPageTemplate, urlPageJs], null, function (pResArr) {
        console.log('UI._ioUI_pageInstall: res = ', pResArr.map(r => r.Ok));

        if (pResArr.length === 3 && pResArr[0].Ok && pResArr[1].Ok && pResArr[2].Ok) {
            var js = '';
            js = pResArr[2].Data.trim();
            if (js.length < 2) js = "{}";
            js = js.substr(1, js.length - 2);
            //console.log(js);

            var pageId = mIOKeyAttr + '-page-' + page;
            js = 'window["' + pageId + '"] = function(){\r\n var app = new Vue({ \r\n' +
                '   mixins: [_ioUI_vueMixinApp], \r\n' +
                '   el: "#' + pageId + '", \r\n' + js + '\r\n' +
                '  }); \r\n  return app; \r\n}';

            _io_cacheUpdate(pageId + '.js', js, 'text/javascript').then(function () {
                var temp = pResArr[0].Data,
                    body =
                        '\r\n<div id="' + pageId + '" style="width: 100%;opacity: 0;">\r\n' +
                        pResArr[1].Data +
                        '\r\n</div>\r\n' +
                        '\r\n<link href="' + urlPageCss + '" rel="stylesheet" /> \r\n' +
                        '\r\n<script src="' + pageId + '.js" type="text/javascript"></script>\r\n' +
                        '\r\n<script src="' + urlSdk + '" type="text/javascript"></script>\r\n';

                _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
                var _temp = _.template(temp);
                var htm = _temp(mIOData);
                //var htm = temp;
                htm = htm.split('[{PAGE_BODY}]').join(body);

                //console.log(mIOData);
                //console.log(temp);
                //console.log(htm);

                _io_cacheUpdate(page, htm, 'text/html').then(function () {
                    if (pCallback) pCallback();

                    //////var url = location.protocol + '//' + location.host + '?page=' + page + '&_=' + mIOId;
                    //////if (location.pathname === '/')

                    ////var url = location.protocol + '//' + location.host + '/' + page;
                    ////console.log('UI._ioUI_pageGo: ', location.href + ' -> ' + url);

                    //////debugger;

                    ////if (page == 'index')
                    ////    location.reload();
                    ////else
                    ////    location.href = url;
                });
            });
        }
    });
}

_ioUI_userLogout = function (pCallback) {
    mIOData.User.Logined = false;
    _io_cacheUpdate('miodata', mIOData, 'application/json').then(function () {
        if (pCallback) pCallback();
        else location.href = '/login';
    });
};

_ioUI_userLogin = function (pCallback) {
    mIOData.User = {
        Logined: true,
        Id: 1,
        UserName: 'thinhenit',
        Token: _io_uuid(),
        FullName: 'Nguyễn Văn Thịnh',
        ShortName: 'Mr Thinh',
        Email: 'thinhenit@gmail.com',
        Phone: '0948003456',
        Avatar: mIOHostPathTheme + '/img/avatars/teams/team-logo-1.jpg'
    };

    _io_cacheUpdate('miodata', mIOData, 'application/json').then(function () {
        if (pCallback) pCallback();
    });
};