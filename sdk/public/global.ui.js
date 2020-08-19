
_ioUI_messageReceived = function (pMessage) {
    if (pMessage == null) return;
    if (pMessage.Error) { console.error('UI._ioUI_messageReceived: ERROR = ', pMessage); return; }

    var type = pMessage.Type, data = pMessage.Data;

    if (type && data) {
        console.log('-> UI.message: ', type, data);
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
                //else {
                //    console.log('UI._sendAsync = ', m);
                //}
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

        //if (mIOWorker) {
        //    mIOWorker.postMessage(pMessage);
        //} else {
        mIOChannel.postMessage(pMessage);
        //}
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
    _io_requestGet(mIOHost + '/io/list.json', 'json').then(function (res) {
        //console.log('_ioUI_vueInstall: ', res);
        mIOUiComponentArray = [];
        if (res.Ok) mIOUiComponentArray = res.Data;
        mIOUiComponentArray.forEach(function (o) {
            var path = mIOHostView + '/' + o.Root + '/' + o.Scope + '/' + o.Name + '/';
            if (o.Files.length > 0 && _.findIndex(o.Files, function (x) { return x == 'controller.js'; }) != -1) {

            }
            if (o.Files.length > 0 && _.findIndex(o.Files, function (x) { return x == 'temp.htm'; }) != -1) {

            }
            if (o.Files.length > 0 && _.findIndex(o.Files, function (x) { return x == 'style.css'; }) != -1) {

            }
            console.log('_ioUI_vueInstall: ', o.Key, path);
        });
        if (pCallback) return pCallback();
    });
};

_ioUI_vueRenderBodyClass = function () {
    return ' ' + mIOKeyAttr + '-theme-' + mIOData.Resource.Theme.Code +
        ' ' + mIOKeyAttr + '-page-' + mIOData.Resource.Page.Code;
}

_ioUI_commitEvent = function (pKey, pFunction) { }

//----------------------------------------------------------------------------------------

_ioUI_firstSetupServiceWorkerCallback = function (pType, pData) {
    console.log(mIOScope + '._ioUI_firstSetupServiceWorkerCallback: data = ', pData);
    _ioUI_pageRouter();
};

_ioUI_tabInit = function () {
    console.log('UI._ioUI_tabInit ... ');
    //setInterval(function () { if (mIOPingPong) { _sendAsync('APP.PING_PONG').then(function (val) { }); } }, 1500);

    _ioUI_sendMessage('TAB.INIT_ID').then(function (pMsg) {
        mIOData = pMsg.Data;
        console.log('UI._ioUI_tabInit: -> TAB.INIT_ID : mIOData.User = ', mIOData.User);
        //debugger;
        _ioUI_pageRouter();
    });
};

_ioUI_pageRouter = function () {
    var pageRouter = localStorage['PAGE_ROUTER'];
    pageRouter = pageRouter || '';

    var uri = new URL(location.href),
        pageQuryString = uri.searchParams.get('page');
    var page = location.pathname;
    page = page === '/' ? 'index' : page.substr(1);

    console.log('UI._ioUI_pageRouter: page = ' + page + '; pageRouter = ' + pageRouter);

    if (!mIOData.User.Logined && page != 'login') {
        console.log('[1] anonymous -> login');
        debugger;
        page = 'login';
        return _ioUI_pageGo(page);
    }

    if (page == pageRouter) {
        console.log('[2] page == pageRouter == ' + page + ' -> _ioUI_pageInit ...');
        debugger;
        localStorage['PAGE_ROUTER'] = '';
        _ioUI_pageInit(page);
        return;
    }



    if (pageRouter.length == 0) {
        return _ioUI_pageGo(page);
    }


    ////if (pageQuryString === null) {
    ////    console.log('UI._ioUI_pageRouter: mIOUiCurrentPage = ' + mIOUiCurrentPage);
    ////    debugger;

    ////    if (mIOUiCurrentPage) {
    ////        page = mIOUiCurrentPage;
    ////    }
    ////    else {
    ////        if (mIOUiPageDefault) page = mIOUiPageDefault;
    ////        else page = 'login';

    ////        //if (!mIOData.User.Logined) page = 'login';
    ////        console.log('UI._ioUI_pageRouter: -> _ioUI_pageGo(' + page + ')');
    ////        //mIOData.Resource.Page.Code = page;
    ////        _ioUI_pageGo(page);
    ////    }
    ////} else {
    ////    var url = location.protocol + '//' + location.host + '/' + pageQuryString;
    ////    console.log('UI._ioUI_pageRouter: ', location.href + ' -> ' + url);
    ////    debugger;
    ////    location.href = url;
    ////}
};

_ioUI_pageGo = function (pCode) {
    console.log('UI._ioUI_pageGo: ' + pCode);
    _ioUI_pageInstall(pCode);
}

_ioUI_pageInstall = function (pCode) {
    pCode = pCode || 'index';
    var page = pCode.toLowerCase();
    console.log('UI._ioUI_pageInstall: ' + page);

    var theme = mIOData.Resource.Theme.Code,
        noCacheId = '___=' + new Date().getTime(),
        urlThemeTemplate = mIOHostView + '/resource/theme/' + theme + '/' + page + '.htm?' + noCacheId,
        urlPageJs = mIOHostView + '/site/' + mIOSiteCode + '/page/' + page + '/app.js?' + noCacheId,
        urlPageCss = mIOHostView + '/site/' + mIOSiteCode + '/page/' + page + '/style.css?' + noCacheId,
        urlPageTemplate = mIOHostView + '/site/' + mIOSiteCode + '/page/' + page + '/index.htm?' + noCacheId,
        urlSdk = mIOHost + '/public/io.sdk.js?' + noCacheId + '&theme=' + theme + '&page=' + page;

    console.log('UI._ioUI_pageInstall = ', page, urlThemeTemplate, urlPageTemplate);

    //debugger

    _io_requestGetArray([urlThemeTemplate, urlPageTemplate, urlPageJs], null, function (pResArr) {
        console.log('UI._ioUI_pageInstall: res = ', pResArr.map(r => r.Ok));

        if (pResArr.length === 3 && pResArr[0].Ok && pResArr[1].Ok && pResArr[2].Ok) {
            var js = '';
            js = pResArr[2].Data.trim();
            if (js.length < 2) js = "{}";
            js = js.substr(1, js.length - 2);
            //console.log(js);

            var pageId = mIOKeyAttr + '-page-' + page,
                pageFunctionName = mIOKeyAttr + '_page_' + page;
            js = 'function ' + pageFunctionName + '(){\r\n var app = new Vue({ \r\n' +
                '   mixins: [_ioUI_vueMixinApp], \r\n' +
                '   el: "#' + pageId + '", \r\n' + js + '\r\n' +
                '  }); \r\n  return app; \r\n}';

            _io_cacheUpdate(pageFunctionName + '.js', js, 'text/javascript').then(function () {
                var temp = pResArr[0].Data,
                    body =
                        '\r\n<link href="' + urlPageCss + '" rel="stylesheet" /> \r\n' +
                        '\r\n<div id="' + pageId + '">\r\n' +
                        pResArr[1].Data +
                        '\r\n</div>\r\n' +
                        '\r\n<script src="' + pageFunctionName + '.js" type="text/javascript"></script>\r\n' +
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
                    //var url = location.protocol + '//' + location.host + '?page=' + page + '&_=' + mIOId;
                    //if (location.pathname === '/')

                    var url = location.protocol + '//' + location.host + '/' + page;
                    console.log('UI._ioUI_pageGo: ', location.href + ' -> ' + url);

                    //debugger;

                    localStorage['PAGE_ROUTER'] = page;
                    if (page == 'index')
                        location.reload();
                    else
                        location.href = url;
                });
            });
        }
    });
}

_ioUI_pageInit = function (pCode) {
    //debugger;
    var page = pCode,
        pageFunctionName = mIOKeyAttr + '_page_' + page;


    mIOUiCurrentPage = page;
    console.log('UI._ioUI_pageInit: ' + page);

    window[pageFunctionName]();
};

_ioUI_userLogout = function (pCallback) {
    mIOData.User.Logined = false;
    _io_cacheUpdate('miodata', mIOData, 'application/json').then(function () {
        if (pCallback) pCallback();
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