var IO = (function () {
    function _UIEngine(pSetting) {
        pSetting = pSetting || {};
        var mId = new Date().getTime(),
            mApp, mMixin = {}, mTemplates = [], mComponents = [],
            mEvents = [];
        //--------------------------------------------------------------------------------------------------
        function logInfo(...args) { console.log(args); }
        function logError(...args) { console.log('->ERROR:', args); }
        function init() { }
        //--------------------------------------------------------------------------------------------------

        ////var worker, watcher = {},
        ////    channel, wsPath,
        ////    supportServiceWorker = 'serviceWorker' in navigator;

        ////function _connect(path_) {
        ////    if (!supportServiceWorker) return;
        ////    wsPath = path_ || 'test-ws';
        ////    navigator.serviceWorker.register('/serviceWorker.js', { scope: '/' }).then(function (reg) {
        ////        if (reg.installing) {
        ////            navigator.serviceWorker.ready.then(function (regInstall) {
        ////                _syncOpen(regInstall);
        ////            });
        ////        } else if (reg.waiting) {
        ////            ;
        ////        } else if (reg.active) {
        ////            _syncOpen(reg);
        ////        }
        ////    }).catch(function (error) {
        ////        console.error('UI: Registration failed with ' + error);
        ////    });
        ////}

        ////function _sendAsync(type, obj) {
        ////    if (!supportServiceWorker) return;
        ////    var queryId = new Date().getTime();
        ////    var msgHandler = new BroadcastChannel(queryId + '');
        ////    return new Promise(resolve => {
        ////        msgHandler.addEventListener('message', event => {
        ////            var data = event.data;
        ////            resolve(data);
        ////            msgHandler.close();
        ////        })
        ////        var m = { id: _ID, queryId: queryId, type: type, input: obj };
        ////        worker.postMessage(m);
        ////    });
        ////}

        ////function _syncOpen(regServiceWorker) {
        ////    worker = regServiceWorker.active;

        ////    channel = new BroadcastChannel('WS_MESSGAE_CHANNEL');
        ////    channel.addEventListener('message', function (event) {
        ////        var m = event.data;
        ////        if (m.id == _ID || m.id == '*') {
        ////            setTimeout(function (m_) { _vueOnMessageRegType(JSON.parse(m_)); }, 1, JSON.stringify(m));
        ////            var keys = Object.keys(watcher);
        ////            for (var i = 0; i < keys.length; i++) {
        ////                if (m.type == keys[i]) {
        ////                    var f = watcher[keys[i]];
        ////                    if (f) f(m);
        ////                    break;
        ////                }
        ////            }
        ////        }
        ////    });
        ////    _sendAsync('TAB_INIT', wsPath).then(function (vl) {
        ////        if (watcher['WS_CONNECTED']) watcher['WS_CONNECTED'](vl);
        ////        _ready();
        ////    });
        ////};

        ////function _registerType(type, onHandler) {
        ////    watcher[type] = onHandler;
        ////}

        //--------------------------------------------------------------------------------------------------
        function getSync(pUrlOrUrls, pType, pHeaders) {
            var self = this;
            pType = pType || 'text';
            if (pUrlOrUrls == null)
                if (pType == 'text') return ''; else return null;
            var url, xhr;
            if (typeof pUrlOrUrls == 'string') {
                url = pUrlOrUrls;
                xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                xhr.send(null);
                var text = '';
                if (xhr.status === 200) text = xhr.responseText.trim();
                if (pType == 'text') return text;
                else if (text.length == 0) return null;
                else {
                    try {
                        return JSON.parse(text);
                    } catch (e) {
                        self.logError('global.getSync[1]:', e.message, url);
                        if (pType == 'text') return ''; else return null;
                    }
                }
            } else if (typeof pUrlOrUrls == 'object' && Array.isArray(pUrlOrUrls)) {
                var a = [];
                for (var i = 0; i < pUrlOrUrls.length; i++) {
                    url = pUrlOrUrls[i];
                    if (pType == 'text') text = ''; else text = null;
                    a.push(text);

                    xhr = new XMLHttpRequest();
                    xhr.open('GET', url, false);
                    xhr.send(null);
                    var text = '';
                    if (xhr.status === 200) text = xhr.responseText.trim();
                    if (pType == 'text') return text;
                    else if (text.length == 0) text = null;
                    else {
                        try {
                            text = JSON.parse(text);
                        } catch (e) {
                            if (pType == 'text') text = ''; else text = null;
                            self.logError('global.getSync[2]:', e.message, url);
                        }
                    }
                    a[i] = text;
                }
                return a;
            }
        }
        function responseFetch(pQueryId, pRequest) {
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
                        if (v.length > 1 && (v[0] == '{' || v[0] == '[')) {
                            try {
                                var data = JSON.parse(v);
                                result = { Ok: true, Code: 200, Data: data, Type: 'json' };
                            } catch (e1) {
                                result = { Ok: false, 1: -1, Error: 'Error convert JSON of response: ' + e1.message, Text: v };
                            }
                        } else if (v.length > 0) {
                            result = { Ok: true, Code: 200, Data: v, Type: 'text' };
                        } else {
                            result = { Ok: false, Code: -2, Data: v, Error: 'Response is empty' };
                        }
                    } else {
                        if (v && v.Ok != null && v.Code != null) {
                            result = v;
                        } else {
                            result = { Ok: false, Data: v, Code: -3, Error: 'Response must be format { Ok:..., CodeL ..., Data:..., Error: ...}' };
                        }
                    }

                    result.QueryId = pQueryId;
                    resolve(result);
                });
            });
        }
        function requestFetch(pQueryId, pMethod, pUrl, pData, pHeaders) {
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

            return responseFetch(pQueryId, request);
        }
        //--------------------------------------------------------------------------------------------------

        //--------------------------------------------------------------------------------------------------
        return {
            init: init,
            Vue: {
                App: self.App,
                Mixin: self.Mixin
            }
        }
    }

    var instance;
    return { getInstance: function (pSetting) { if (instance === undefined) { instance = new _UIEngine(pSetting); } return instance; } };
})().getInstance();
IO.init();