var IO = (function () {
    function _UIEngine(pSetting) {
        pSetting = pSetting || {};
        pSetting.libArray = pSetting.libArray || ['classie', 'lodash.min', 'vue.min'];

        //--------------------------------------------------------------------------------------------------

        function logInfo(...args) { console.log(args); }
        function logError(...args) { console.log('->ERROR:', args); }

        //--------------------------------------------------------------------------------------------------

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

        function serviceWorkerSetup() {
            console.log('UI.serviceWorkerSetup() ...');

            if (!mIOSupportServiceWorker) return;

            var urlSW = location.protocol + '//' + location.host + '/io.sw.js' + '?host=' + mIOHost;
            console.log('UI.URL_SW = ', urlSW);

            navigator.serviceWorker.register(urlSW, { scope: '/' }).then(function (reg) {
                if (reg.installing) {
                    navigator.serviceWorker.ready.then(function (regInstall) {
                        serviceWorkerReady('INSTALLING', regInstall);
                    });
                } else if (reg.waiting) {
                    ;
                } else if (reg.active) {
                    serviceWorkerReady('ACTIVE', reg);
                }
            }).catch(function (error) {
                console.error('UI: Registration failed with error: ', error);
            });
        }

        function serviceWorkerReady(pState, pRegServiceWorker) {
            console.log('UI.serviceWorkerReady: ', pState);
            mIOWorker = pRegServiceWorker.active;
            if (pState == 'ACTIVE') {
                _ioUI_tabInit();
            }
        };

        function init(pCallback) {
            var uriSDK = new URL(document.currentScript.src);
            var uriRoot = uriSDK.protocol + '//' + uriSDK.host;
            var urls = [
                uriRoot + '/public/init.js',
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
                _goPage = _ioUI_goPage;

                _io_configInit(function () {

                    mIOChannel.addEventListener('message', function (pEvent) {
                        _ioUI_messageReceived(pEvent.data);
                    });
                    window.addEventListener("beforeunload", function (e) {
                        try {
                            _ioUI_sendMessage('TAB.CLOSE', mIOId);
                            return false;
                        } catch (e) { ; }
                    });

                    var arrJsSite = [
                        mIOHostView + '/site/mixin.js',
                        mIOHostView + '/site/' + mIOSiteCode + '/api.js',
                        mIOHostView + '/site/' + mIOSiteCode + '/interface.js',
                        mIOHostView + '/site/' + mIOSiteCode + '/mapper.js',
                        mIOHostView + '/site/' + mIOSiteCode + '/test.js',
                        mIOHostView + '/site/' + mIOSiteCode + '/ui.js'];

                    _scriptInsertHeaderArray(arrJsSite, function (pRes) {
                        if (mIOUiCurrentTheme && mIOUiCurrentPage) {
                            _ioUI_linkCssInsertHeaderArray([
                                mIOHostView + '/site/style.css',
                                mIOHostView + '/site/' + mIOSiteCode + '/page/' + mIOUiCurrentPage + '/style.css']);
                            _ioUI_scriptInsertHeader(mIOHostView + '/site/' + mIOSiteCode + '/page/' + mIOUiCurrentPage + '/app.js', function () {

                                console.log(mIOScope + ': theme = ', mIOUiCurrentTheme);
                                console.log(mIOScope + ': page = ', mIOUiCurrentPage);

                                _ioUI_tabInit();
                            });
                        } else {
                            serviceWorkerSetup();
                        }                        
                    });
                });
            });
        }



        var mApp, mMixin = {}, mTemplates = {}, mComponentArray = [], mEventArray = [];
        mMixin = {
            props: ['id', 'text', 'item', 'items'],
            computed: {
                _Element: function () {
                    var _self = this;
                    var el = _self.$el;
                    return el;
                },
                _KeyName: function () {
                    var _self = this;
                    var key = _self.$vnode.componentOptions.tag;
                    key = key || '';
                    return key;
                },
            },
            mounted: function () {
                var _self = this;
                var el = _self._Element;
                if (el) {
                    var keyName = _self._KeyName;
                    el.setAttribute(mKeyAttr + '-key', keyName);
                    classie.add(el, keyName);
                }
            },
            methods: {
                registerEvent: function (type, pCallback) {
                    var _self = this;
                    var keyName = _self._KeyName;
                    mEventArray.push({ type: type, key: keyName, callback: pCallback });
                },
                textGet: function (keyText) {
                    return '123';
                }
            }
        };

        function pageSetup(pCallback) {
            if (mIsIE) return console.error('Can not support browser IE');
            var libArray = Array.from(pSetting.libArray).map(function (o) { return mHostView + '/lib/' + o + '.js'; });
            scriptInsertHeaderArray(libArray, function (rValArray) {
                var returnFails = Array.from(rValArray).filter(function (o) { return o.Ok = false; });
                if (returnFails.length > 0) {
                    if (pCallback) pCallback({ Ok: false, Message: 'Loading libraries did not success', Data: returnFails });
                } else {
                    vueSetup(pCallback);
                }
            });
        }

        function vueSetup(pCallback) {
            mTemplateArray = [];
            requestFetch(0, 'GET', mHostView + '/list.json').then(function (r) {
                if (r.Ok && r.Data) {
                    var arrComs = r.Data;
                    if (arrComs && Array.isArray(arrComs) && arrComs.length > 0) {
                        mComponentArray = arrComs;

                        var fetTempArray = [], fetJsArray = [];

                        arrComs.forEach(function (c) {
                            var keyName = c.key;
                            var keyPath = c.root + '/' + c.scope + '/' + c.name;
                            if (keyName && c.files && Array.isArray(c.files) && c.files.length > 0) {
                                var jsArray = _.filter(c.files, function (o) { return o.startsWith('controller') && o.endsWith('.js'); });
                                var cssArray = _.filter(c.files, function (o) { return o.startsWith('style') && o.endsWith('.css'); });
                                var tempArray = _.filter(c.files, function (o) { return o.startsWith('temp') && o.endsWith('.htm'); });
                                if (cssArray.length > 0) {
                                    cssArray = _.map(cssArray, function (o) { return mHostView + '/' + keyPath + '/' + o; });
                                    setTimeout(function (arr, kiName) {
                                        arr.forEach(function (fileCss) {
                                            var link = document.createElement('link');
                                            link.setAttribute('href', fileCss);
                                            link.setAttribute('rel', 'stylesheet');
                                            link.setAttribute('id', kiName + '.css');
                                            document.head.appendChild(link);
                                            //console.log(fileCss);
                                        });
                                    }, 1, cssArray, keyName);
                                }

                                if (tempArray.length > 0) {
                                    tempArray.forEach(function (fiName) {
                                        var pathFileName = keyPath + '/' + fiName;
                                        mTemplates[pathFileName] = '';
                                        var fet = requestFetch(0, 'GET', mHostView + '/' + pathFileName, null, null, 'text');
                                        fetTempArray.push(fet);
                                    });
                                }

                                if (jsArray.length > 0) {
                                    jsArray.forEach(function (fiName) {
                                        var pathFileName = keyPath + '/' + fiName;
                                        var fet = requestFetch(0, 'GET', mHostView + '/' + pathFileName, null, null, 'text');
                                        fetJsArray.push(fet);
                                    });
                                }
                            }
                        });

                        Promise.all(fetTempArray).then(function (arr) {
                            if (arr && arr.length > 0) {
                                arr.forEach(function (r) {
                                    if (r.Ok && r.Data && r.Url) {
                                        var a = r.Url.split('/');
                                        var keyName = a[a.length - 4] + '_' + a[a.length - 3] + '_' + a[a.length - 2];
                                        mTemplates[keyName] = r.Data;
                                    }
                                });
                            }
                        });
                        //console.log(mTemplates,jsLinkArray);

                        Promise.all(fetJsArray).then(function (arr) {
                            var jsArray = [], idArray = [];
                            if (arr && arr.length > 0) {
                                arr.forEach(function (r) {
                                    if (r.Ok && r.Data && r.Url) {
                                        var a = r.Url.split('/');
                                        var keyName = a[a.length - 4] + '_' + a[a.length - 3] + '_' + a[a.length - 2];
                                        var js = '\r\nVue.component("' + keyName + '", { \r\n ' +
                                            '   mixins: [IO.Vue.Mixin], \r\n ' +
                                            '   template: IO.Vue.getTemplate("' + keyName + '"), \r\n ' +
                                            r.Data.trim().substr(1) + '); \r\n ';
                                        var blob = new Blob([js], { type: 'text/javascript' });
                                        var url = URL.createObjectURL(blob);
                                        jsArray.push(url);
                                        idArray.push(keyName + '.js');
                                    }
                                });
                            }
                            return { jsArray: jsArray, idArray: idArray };
                        }).then(function (it) {
                            scriptInsertHeaderArray(it.jsArray, function () {
                                vueInit(pCallback);
                            }, it.idArray);
                        });
                    } else {
                        console.error('Can not find Url: ' + url);
                    }
                }
            });
        }

        function vueInit(pCallback) {
            if (mEventArray['UI.VUE_SETUP']) setTimeout(function () { mEventArray['UI.VUE_SETUP'](); }, 1);

            console.log('VUE_SETUP = ', document.currentScript);

            //var ready = document.querySelectorAll('*[vui-name]').length > 0;
            //if (ready) _vueReady(pCallback);
            //else {
            //    timerReady = setInterval(function (pCallback_) {
            //        var ready_ = document.querySelectorAll('*[vui-name]').length > 0;
            //        if (ready_) {
            //            clearInterval(timerReady);
            //            _vueReady(pCallback_);
            //        }
            //    }, 200, pCallback);
            //}
        }

        function vueReady() {
            if (mEventArray['UI.VUE_INIT']) setTimeout(function () { mEventArray['UI.VUE_INIT'](); }, 1);

            //var data = {}, props = '';
            ////Object.keys(vueMixin.props).forEach(function (o, index) {
            ////    if (o[o.length - 1] == 's') data[o] = [];
            ////    else data[o] = '';
            ////    props += ' :' + o + '="' + o + '" ';
            ////});
            //var el = document.querySelector('*[vui-name]');
            //var key = el.getAttribute('vui-name');
            //var template = '<' + key + props + '></' + key + '>';
            //el.innerHTML = template;

            //vueApp = new Vue({
            //    el: el,
            //    data: function () { return data; },
            //    mounted: function () {
            //        Vue.nextTick(function () {
            //            if (watcher['VUE_READY']) watcher['VUE_READY']();
            //        });
            //    }
            //});
        }

        function vueOnMessageRegType(m) {
            var keys = Object.keys(vueRegType);
            for (var i = 0; i < keys.length; i++) {
                if (m.type == keys[i]) {
                    setTimeout(function (i_) {
                        var f = vueRegType[keys[i_]];
                        if (f && typeof f == 'function') f(m);
                        //else delete vueRegType[keys[i_]];
                    }, 1, i);
                    break;
                }
            }
        }

        function vueTemplateGetByKey(keyView) {
            var htm = '';
            if (mTemplates.hasOwnProperty(keyView)) htm = mTemplates[keyView];
            if (htm.length == 0) htm = '<div></div>';
            return htm;
        }

        //--------------------------------------------------------------------------------------------------

        function _syncOnMessage(m) {
            if (m == null) return;

            if (m.type != 'APP.PING_PONG') {
                if (m.error) {
                    console.error('UI.message_received = ', m);
                    return;
                }
                //else console.log('UI.message_received = ', m);
            }

            var valid = m.id == mId || m.id == '*';
            if (!valid) {
                // Check type CHAT_BOX must be valid ticketId is showing ...
            }
            if (valid && m.type && watcher.hasOwnProperty(m.type)) watcher[m.type](m);
        }

        function _syncOpen(regServiceWorker) {
            //setInterval(function () {
            //    _sendAsync('APP.PING_PONG').then(function (val) {
            //        //console.log('$$$$$$$$ APP.PING_PONG = ', val.data);
            //        console.log('PING_PONG');
            //    });
            //}, 1500);

            worker = regServiceWorker.active;

            channel = new BroadcastChannel('SW_MESSGAE_CHANNEL');
            channel.addEventListener('message', function (event) { _syncOnMessage(event.data); });
            _sendAsync('APP.TAB_INIT', { apiHost: API_HOST, wsHostPath: WS_HOST_PATH }).then(function (DATA_) {
                _ready(DATA_, function (VAL_) {
                    if (watcher['APP.TAB_INIT']) watcher['APP.TAB_INIT'](VAL_);
                });
            });
        };

        function _registerEvent(type, onHandler) {
            watcher[type] = onHandler;
        }

        function _commitEvent(type, data, event) {
            if (watcher.hasOwnProperty(type)) {
                var f = watcher[type];
                if (f && typeof f == 'function') {
                    switch (f.length) {
                        case 0:
                            f();
                            break;
                        case 1:
                            f(data);
                            break;
                        case 2:
                            f(data, event);
                            break;
                    }
                    //else delete watcher[keys[i_]];
                }
            }
        }

        //--------------------------------------------------------------------------------------------------


        function getCache() {
            return new Promise((resolve, reject) => {
                //caches.keys().then(function (cacheNames) {
                //    cacheNames.forEach(function (cacheName) {
                //        window.caches.open(cacheName).then(function (cache) {
                //            return cache.keys();
                //        }).then(function (requests) {
                //            requests.forEach(function (request) {
                //                addRequestToList(cacheName, request);
                //            });
                //        });
                //    });
                //});

                caches.open('CACHE').then(function (cache) {
                    cache.match('/DATA').then(function (res) {
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
                    });
                });
            });
        }







        return {
            init: init,
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
IO.init(function () {

});