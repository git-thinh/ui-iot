﻿
_ioUI_goPage = function (pCode) {
    var page = pCode || mIOData.Resource.Page.Code;
    mIOData.Resource.Page.Code = page;

    var theme = mIOData.Resource.Theme.Code,
        noCacheId = '___=' + new Date().getTime(),
        urlThemeTemplate = mIOHostView + '/resource/theme/' + theme + '/' + page + '.htm?' + noCacheId,
        urlPageJs = mIOHostView + '/site/' + mIOSiteCode + '/page/' + page + '/app.js?' + noCacheId,
        urlPageCss = mIOHostView + '/site/' + mIOSiteCode + '/page/' + page + '/style.css?' + noCacheId,
        urlPageTemplate = mIOHostView + '/site/' + mIOSiteCode + '/page/' + page + '/index.htm?' + noCacheId,
        urlSdk = mIOHost + '/public/io.sdk.js?' + noCacheId + '&theme=' + theme + '&page=' + page;

    console.log('UI._ioUI_goPage() = ', page, urlThemeTemplate, urlPageTemplate);

    //debugger

    _io_requestGetArray([urlThemeTemplate, urlPageTemplate], null, function (pResArr) {
        console.log('UI._pageGo: ', theme, page, pResArr);
        if (pResArr.length === 2 && pResArr[0].Ok && pResArr[1].Ok) {
            var temp = pResArr[0].Data,
                body = '<div id="' + mIOKeyAttr + '-page-' + page + '" style="display:none;">' + pResArr[1].Data + '</div>' +
                    '\r\n <script src="' + urlSdk + '" type="text/javascript"></script>';

            temp = temp.split('[{PAGE_BODY}]').join(body);

            //console.log(htm);
            _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
            var _temp = _.template(temp);
            var htm = _temp(mIOData);

            //console.log(mIOData);
            //console.log(htm);

            _io_cacheUpdate(page, htm, 'text/html').then(function () {
                var url = location.protocol + '//' + location.host + '/' + page;
                console.log(url);
                debugger;
                location.href = url;
            });
        }
    });
}

_ioUI_firstSetupServiceWorkerCallback = function (pType, pData) {
    console.log(mIOScope + '._ioUI_firstSetupServiceWorkerCallback: data = ', pData);
    _ioUI_siteInit();
};


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

_ioUI_vueRenderBodyClass = function () {
    return ' ' + mIOKeyAttr + '-theme-' + mIOData.Resource.Theme.Code +
        ' ' + mIOKeyAttr + '-page-' + mIOData.Resource.Page.Code;
}


_ioUI_commitEvent = function (pKey, pFunction) { }


_ioUI_tabInit = function () {
    console.log('UI._ioUI_tabInit ... ');
    //setInterval(function () { if (mIOPingPong) { _sendAsync('APP.PING_PONG').then(function (val) { }); } }, 1500);
    _ioUI_sendMessage('TAB.INIT_ID').then(function (pMsg) {
        mIOData = pMsg.Data;

        var page = '';
        if (mIOData.User.Logined) {
            page = 'login';
        } else {
            page = 'dashboard';
        }
        mIOData.Resource.Page.Code = page;

        console.log('UI._ioUI_tabInit(): ' + page + '; mIOData = ', mIOData);

        _ioUI_siteInit();
    });
};



_ioUI_siteInit = function () {
    console.log(mIOScope + ': theme = ', mIOUiCurrentTheme);
    console.log(mIOScope + ': page = ', mIOUiCurrentPage);

    if (mIOUiCurrentTheme && mIOUiCurrentPage) {
        _ioUI_appInit();
    } else {
        _ioUI_goPage();
    }
};