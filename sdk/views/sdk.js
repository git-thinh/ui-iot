var IO = (function () {
    function _UIEngine(pSetting) {
        var mIsIE = navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.indexOf("Trident ") > 0;
        var urlSrcSelf, mHost;

        if (!mIsIE) {
            urlSrcSelf = new URL(document.currentScript.src);
            mHost = urlSrcSelf.protocol + '//' + urlSrcSelf.host;
        }

        pSetting = pSetting || {};
        pSetting.libArray = pSetting.libArray || ['classie', 'head.load.min', 'lodash.min', 'vue.min'];

        var mId = new Date().getTime(),
            mApp, mMixin = {}, mTemplates = [], mComponents = [],
            mEvents = [];

        //--------------------------------------------------------------------------------------------------

        function logInfo(...args) { console.log(args); }
        function logError(...args) { console.log('->ERROR:', args); }

        //--------------------------------------------------------------------------------------------------

        function getSync(pUrlOrUrls, pType, pHeaders) {
            var self = this;
            pType = pType || 'json';
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

        function scriptInsertHeader(url, callback) {
            var valid = false;
            if (url && url.length > 0) {
                var key = url.toLowerCase();
                document.querySelectorAll('script').forEach(function (es) {
                    if (es.hasAttribute('src') &&
                        !es.getAttribute('src').toLowerCase().endsWith(key)) {
                        valid = true;
                        var script = document.createElement('script');
                        script.onload = function () {
                            if (callback) callback({ Ok: true, Url: url });
                        };
                        script.setAttribute('src', url);
                        document.head.appendChild(script);
                    }
                });
            }
            if (!valid && callback) callback({ Ok: false, Url: url });
        }
        function scriptInsertHeaderArray(urls, callback) {
            if (urls && Array.isArray(urls) && urls.length > 0) {
                var arrPro = [];
                Array.from(urls).forEach(function (url) {
                    var pro = new Promise(function (resolve, rejected) {
                        scriptInsertHeader(url, function (rVal) {
                            resolve(rVal);
                        });
                    });
                    arrPro.push(pro);
                });
                Promise.all(arrPro).then(function (rValArray) {
                    if (callback) callback(rValArray);
                });
            } else {
                if (!valid && callback) callback([]);
            }
        }

        function libSetup(callback) {
            var libArray = Array.from(pSetting.libArray).map(function (o) { return mHost + '/views/lib/' + o + '.js'; });
            scriptInsertHeaderArray(libArray, function (rValArray) {
                var returnFails = Array.from(rValArray).filter(function (o) { return o.Ok = false; });
                if (returnFails.length > 0) {
                    if (callback) callback({ Ok: false, Message: 'Loading libraries did not success', Data: returnFails });
                } else {
                    if (callback) callback({ Ok: true, Data: rValArray });
                }
            });
        }

        //--------------------------------------------------------------------------------------------------

        function vueComSetup(callback) {
            var url = mHost + '/views/list.txt';
            var arrComs = getSync(url);
            if (arrComs && arrComs.length > 0) {
                Array.from(arrComs).forEach(function (com) {

                });
            } else {
                console.error('Can not find Url: ' + url);
            }
        }

        //--------------------------------------------------------------------------------------------------

        function init(callback) {
            if (mIsIE) return console.error('Can not support browser IE');
            libSetup(function (rVal) {
                if (rVal.Ok) {
                    vueComSetup(callback);
                } else {
                    console.error(rVal.Message, rVal.Data);
                }
            })
        }

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