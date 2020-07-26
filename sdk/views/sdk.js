var IO = (function () {
    function _UIEngine(pSetting) {
        var mKeyAttr = 'io';
        var mIsIE = navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.indexOf("Trident ") > 0;
        var urlSrcSelf, mHost, mHostView;

        if (!mIsIE) {
            urlSrcSelf = new URL(document.currentScript.src);
            mHost = urlSrcSelf.protocol + '//' + urlSrcSelf.host;
            mHostView = urlSrcSelf.protocol + '//' + urlSrcSelf.host + '/views';
        }

        pSetting = pSetting || {};
        pSetting.libArray = pSetting.libArray || ['classie', 'lodash.min', 'vue.min'];

        var mId = new Date().getTime();

        //--------------------------------------------------------------------------------------------------

        function logInfo(...args) { console.log(args); }
        function logError(...args) { console.log('->ERROR:', args); }

        //--------------------------------------------------------------------------------------------------

        function responseFetch(pQueryId, pRequest, pMethod, pUrl, pResultTypeJsonOrText) {
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
        }
        function requestFetch(pQueryId, pMethod, pUrl, pData, pHeaders, pResultTypeJsonOrText) {
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

            return responseFetch(pQueryId, request, pMethod, pUrl, pResultTypeJsonOrText);
        }

        function scriptInsertHeader(url, pCallback, id) {
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
        function scriptInsertHeaderArray(urls, pCallback, ids) {
            if (urls && Array.isArray(urls) && urls.length > 0) {
                var arrPro = [];
                Array.from(urls).forEach(function (url, index) {
                    var pro = new Promise(function (resolve, rejected) {
                        var id;
                        if (ids && ids.length > index) id = ids[index];
                        scriptInsertHeader(url, function (rVal) {
                            resolve(rVal);
                        }, id);
                    });
                    arrPro.push(pro);
                });
                Promise.all(arrPro).then(function (rValArray) {
                    if (pCallback) pCallback(rValArray);
                });
            } else {
                if (!valid && pCallback) pCallback([]);
            }
        }

        //--------------------------------------------------------------------------------------------------

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

        var mWorker, mChannel, mSupportServiceWorker = ('serviceWorker' in navigator);

        function swSetup(pCallback) {
            if (!mSupportServiceWorker) return;

            var url = location.protocol + '//' + location.host + '/sw/io.sdk.serviceWorker.js';
            console.log('UI.swSetup: url = ', url);

            navigator.serviceWorker.register(url, { scope: '/sw/' }).then(function (reg) {
                if (reg.installing) {
                    navigator.serviceWorker.ready.then(function (regInstall) {
                        swInit('INSTALLING', regInstall, pCallback);
                    });
                } else if (reg.waiting) {
                    ;
                } else if (reg.active) {
                    swInit('ACTIVE', reg, pCallback);
                }
            }).catch(function (error) {
                console.error('UI: Registration failed with ' + error);
            });
        }

        function swInit(pState, pRegServiceWorker, pCallback) {
            console.log('UI.swInit: state = ', pState);

            //setInterval(function () {
            //    _sendAsync('APP.PING_PONG').then(function (val) {
            //        //console.log('$$$$$$$$ APP.PING_PONG = ', val.data);
            //        console.log('PING_PONG');
            //    });
            //}, 1500);

            mWorker = pRegServiceWorker.active;
            mChannel = new BroadcastChannel('SW_MESSGAE_CHANNEL');
            mChannel.addEventListener('message', function (pEvent) { swOnMessage(pEvent.data); });

            ////_sendAsync('APP.TAB_INIT', { apiHost: API_HOST, wsHostPath: WS_HOST_PATH }).then(function (DATA_) {
            ////    _ready(DATA_, function (VAL_) {
            ////        if (watcher['APP.TAB_INIT']) watcher['APP.TAB_INIT'](VAL_);
            ////    });
            ////});
        };

        function swOnMessage(pMessage) {
            ////if (pMessage == null) return;

            ////if (pMessage.type != 'APP.PING_PONG') {
            ////    if (pMessage.error) {
            ////        console.error('UI.message_received = ', pMessage);
            ////        return;
            ////    }
            ////    //else console.log('UI.message_received = ', pMessage);
            ////}

            ////var valid = pMessage.id == _ID || pMessage.id == '*';
            ////if (!valid) {
            ////    // Check type CHAT_BOX must be valid ticketId is showing ...
            ////}
            ////if (valid && pMessage.type && watcher.hasOwnProperty(pMessage.type)) watcher[pMessage.type](pMessage);
        }







        function swSendMessage(type, obj) {
            if (!supportServiceWorker) {
                return _sendAsync_fix(type, obj);
            }

            var queryId = new Date().getTime();
            var msgHandler = new BroadcastChannel(queryId + '');
            return new Promise(function (resolve, rej) {
                msgHandler.addEventListener('message', function (event) {
                    var m = event.data;
                    if (m.type != 'APP.PING_PONG') {
                        if (m.error) {
                            console.error('UI.message_received = ', m);
                            return;
                        }
                        else console.log('UI._sendAsync = ', m);
                    }

                    if (m.type == 'APP.LOGIN') {
                        if (m.ok && m.data) localStorage.setItem('USER', JSON.stringify(m.data));
                        setTimeout(function (m_) { resolve(m_); }, 500, m);
                    } else if (m.type == 'APP.LOGIN') {
                        if (m.ok) localStorage.removeItem('USER');
                        setTimeout(function (m_) { resolve(m_); }, 500, m);
                    } else resolve(m);

                    //if (m.close == true) msgHandler.close();
                });
                var msg = { id: _ID, queryId: queryId, type: type, input: obj };
                worker.postMessage(msg);
            });
        }

        function _syncOnMessage(m) {
            if (m == null) return;

            if (m.type != 'APP.PING_PONG') {
                if (m.error) {
                    console.error('UI.message_received = ', m);
                    return;
                }
                //else console.log('UI.message_received = ', m);
            }

            var valid = m.id == _ID || m.id == '*';
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

        function init(pCallback) {
            swSetup(pCallback);
        }

        //--------------------------------------------------------------------------------------------------

        return {
            init: init,
            sendMessage: swSendMessage,
            Vue: {
                App: mApp,
                Mixin: mMixin,
                getTemplate: vueTemplateGetByKey
            }
        }
    }

    var instance;
    return { getInstance: function (pSetting) { if (instance === undefined) { instance = new _UIEngine(pSetting); } return instance; } };
})().getInstance();
IO.init();