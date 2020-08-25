var IO = (function () {
    function _UIEngine(pSetting) {
        pSetting = pSetting || {};
        var _cacheUpdate,
            _responseFetch,
            _requestFetch,
            _requestGet,
            _requestGetArray,
            _linkCssInsertHeader,
            _linkCssInsertHeaderArray,
            _scriptInsertHeader,
            _scriptInsertHeaderArray,
            _commitEvent,
            _goPage;

        //--------------------------------------------------------------------------------------------------

        function serviceWorkerRemove(pCallback) {
            //if (!mIOSupportServiceWorker) return;
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                if (registrations.length === 0) return pCallback(false);

                for (let registration of registrations) {
                    registration.unregister().then(function () {
                        sessionStorage['SW_REINSTALL'] = 'true'
                        //return self.clients.matchAll();
                        //debugger;
                        location.reload();
                        return;
                    }).then(function (clients) {
                        //clients.forEach(client => { if (client.url && "navigate" in client) { client.navigate(client.url));
                    });
                }
            });
        }

        function serviceWorkerCheckExist(pCallback) {
            if (!mIOSupportServiceWorker) return;
            navigator.serviceWorker.getRegistrations().then(function (regs) {
                //console.log(regs);
                if (regs && regs.length > 0) {
                    for (var i = 0; i < regs.length; i++) {
                        var worker = regs[i].active, url;
                        if (worker) url = worker.scriptURL;
                        if (url && url.indexOf('/io.sw.js') > 0) {
                            if (pCallback) return pCallback(true, worker);
                        }
                    }
                }
                if (pCallback) return pCallback(false);
            });
        }

        function serviceWorkerSetup(pCallback) {
            console.log('UI.serviceWorkerSetup() ...');
            if (!mIOSupportServiceWorker) return;

            serviceWorkerCheckExist(function (pExist, pWorker) {
                console.log('UI.serviceWorkerCheckExist: ', pExist);

                if (pExist) {
                    mIOWorker = pWorker;
                    mIOWorkerState = 'EXIST';
                    if (pCallback) return pCallback();
                } else {
                    var urlSW = location.protocol + '//' + location.host + '/io.sw.js' + '?host=' + mIOHost;
                    var scope = './';
                    if (mIOHost === mIOHostClient) {
                        urlSW = location.protocol + '//' + location.host + '/public/io.sw.js' + '?host=' + mIOHost;
                        scope = './public/';
                    }
                    console.log('UI.URL_SW = ', urlSW);

                    navigator.serviceWorker.register(urlSW, { scope: scope }).then(function (reg) {
                        if (reg.installing) {
                            navigator.serviceWorker.ready.then(function (regInstall) {
                                mIOWorker = regInstall.active;
                                mIOWorkerState = 'ACTIVE';
                                if (pCallback) return pCallback();
                            });
                        } else if (reg.waiting) {
                            ;
                        } else if (reg.active) {
                            mIOWorker = reg.active;
                            mIOWorkerState = 'ACTIVE';
                            if (pCallback) return pCallback();
                        }
                    }).catch(function (error) {
                        console.error('UI: Registration failed with error: ', error);
                    });
                }
            });
        }

        function init() {
            var uriSDK;
            if (document.currentScript) {
                uriSDK = new URL(document.currentScript.src);
            } else {
                document.querySelectorAll('script').forEach(function (el) {
                    if (el.src && el.src.endsWith('/public/io.sdk.js'))
                        uriSDK = new URL(el.src);
                })
            }

            var uriRoot = uriSDK.protocol + '//' + uriSDK.host;
            var urls = [
                uriRoot + '/public/io.init.js',
                uriRoot + '/public/global.js',
                uriRoot + '/public/global.ui.js',

                uriRoot + '/public/lib/localforage.min.js',
                uriRoot + '/public/lib/vue.min.js',
                uriRoot + '/public/lib/lodash.min.js',
                uriRoot + '/public/lib/filetype.js',
                uriRoot + '/public/lib/classie.js',
                uriRoot + '/public/lib/md5.js',
                uriRoot + '/public/lib/aes.js'
            ];

            var arrPro = urls.map(function (url, index) {
                return new Promise(function (resolve, rejected) {
                    var script = document.createElement('script');
                    script.onload = function () {
                        resolve({ Ok: true, Url: url });
                    };
                    script.setAttribute('src', url);
                    document.head.appendChild(script);
                });
            });
            Promise.all(arrPro).then(function (rValArr) {
                _cacheUpdate = _io_cacheUpdate;
                _responseFetch = _io_responseFetch;
                _requestFetch = _io_requestFetch;
                _requestGet = _io_requestGet;
                _requestGetArray = _io_requestGetArray;

                _linkCssInsertHeader = _ioUI_linkCssInsertHeader;
                _linkCssInsertHeaderArray = _ioUI_linkCssInsertHeaderArray;
                _scriptInsertHeader = _ioUI_scriptInsertHeader;
                _scriptInsertHeaderArray = _ioUI_scriptInsertHeaderArray;
                _commitEvent = _ioUI_commitEvent;
                _goPage = _ioUI_pageGo;

                _io_configInit(function () {

                    window.addEventListener("beforeunload", function (e) {
                        try {
                            _ioUI_sendMessage('TAB.CLOSE', mIOId);
                            return false;
                        } catch (e) { ; }
                    });

                    _ioUI_linkCssInsertHeader(mIOHostView + '/site/style.css');

                    var arrJsSite = [
                        mIOHostView + '/site/mixin.js',
                        mIOHostView + '/site/' + mIOSiteCode + '/api.js',
                        mIOHostView + '/site/' + mIOSiteCode + '/interface.js',
                        mIOHostView + '/site/' + mIOSiteCode + '/mapper.js',
                        mIOHostView + '/site/' + mIOSiteCode + '/test.js',
                        mIOHostView + '/site/' + mIOSiteCode + '/ui.js'];

                    _scriptInsertHeaderArray(arrJsSite, function (pRes) {
                        _ioUI_vueInstall(function () {


                            serviceWorkerSetup(function () {
                                console.log('@@@@@@@@@@ UI.serviceWorkerSetup = ' + mIOWorkerState + ' -> _ioUI_tabInit ...');

                                navigator.serviceWorker.addEventListener('message', function (event) {
                                    _ioUI_messageReceived(event.data);
                                });

                                _ioUI_tabInit();
                            });
                        });
                    });


                });
            });
        }

        //--------------------------------------------------------------------------------------------------

        return {
            init: function () {
                if (location.pathname === '/' && sessionStorage['SW_REINSTALL'] != 'true') {
                    serviceWorkerRemove(function (removed) {
                        if (!removed) init();
                    });
                } else init();
            },

            cacheUpdate: _cacheUpdate,
            responseFetch: _responseFetch,
            requestFetch: _requestFetch,
            requestGet: _requestGet,
            requestGetArray: _requestGetArray,

            linkCssInsertHeader: _linkCssInsertHeader,
            linkCssInsertHeaderArray: _linkCssInsertHeaderArray,
            scriptInsertHeader: _scriptInsertHeader,
            scriptInsertHeaderArray: _scriptInsertHeaderArray,

            commitEvent: _commitEvent,
            goPage: _goPage
        }
    }
    var instance;
    return { getInstance: function (pSetting) { if (instance === undefined) { instance = new _UIEngine(pSetting); } return instance; } };
})().getInstance();
IO.init();