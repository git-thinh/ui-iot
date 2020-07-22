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
        pSetting.libArray = pSetting.libArray || ['classie', 'head.load.min', 'lodash.min', 'vue.min'];

        var mId = new Date().getTime();

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
                //document.querySelectorAll('script').forEach(function (es) {
                //    if (es.hasAttribute('src') &&
                //        !es.getAttribute('src').toLowerCase().endsWith(key)) {
                valid = true;
                console.log(url);
                var script = document.createElement('script');
                script.onload = function () {
                    if (callback) callback({ Ok: true, Url: url });
                };
                script.setAttribute('src', url);
                document.head.appendChild(script);
                //}
                //});
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
            var libArray = Array.from(pSetting.libArray).map(function (o) { return mHostView + '/lib/' + o + '.js'; });
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

        var mApp, mMixin = {}, mTemplateArray = [], mComponentArray = [], mEventArray = [];
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
                registerEvent: function (type, callback) {
                    var _self = this;
                    var keyName = _self._KeyName;
                    mEventArray.push({ type: type, key: keyName, callback: callback });
                },
                textGet: function (keyText) {
                    return '123';
                }
            }
        };

        function vueSetup(callback) {
            mTemplateArray = [];
            var url = mHostView + '/list.json';
            var arrComs = getSync(url);
            if (arrComs && Array.isArray(arrComs) && arrComs.length > 0) {
                mTemplateArray = arrComs;
                mTemplateArray.forEach(function (c) {
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
                    }
                });
            } else {
                console.error('Can not find Url: ' + url);
            }
        }



        function vueInit() {
            var scope = 'kit', group, name, arr = [];
            var keys = Object.keys(options.views.kit);
            for (var i = 0; i < keys.length; i++) {
                group = keys[i];
                arr = options.views[scope][group];
                for (var j = 0; j < arr.length; j++) {
                    name = arr[j];
                    var key = (scope + '_' + group + '_' + name).toLowerCase();
                    var path = '/Views/' + scope + '/' + group + '/' + name + '/';
                    vueTemps[key] = _getUrlSync(path + 'temp.htm');
                    vueComs.push({ key: key, path: path });
                }
            }

            scope = 'widget';
            keys = Object.keys(options.views.kit);
            for (var i = 0; i < keys.length; i++) {
                group = keys[i];
                arr = options.views[scope][group];
                for (var j = 0; j < arr.length; j++) {
                    name = arr[j];
                    var key = (scope + '_' + group + '_' + name).toLowerCase();
                    var path = '/Views/' + scope + '/' + group + '/' + name + '/';
                    vueTemps[key] = _getUrlSync(path + 'temp.htm');
                    vueComs.push({ key: key, path: path });
                }
            }

            var timerReady;
            var arrLinkJs = vueComs.map(o => { return o.path + 'controller.js'; });
            var arrLinkCss = vueComs.map(o => { return o.path + 'style.css'; });
            arr = _.unionBy(arrLinkJs, arrLinkCss);
            head.load(arr);
            head.ready(function () {
                if (watcher['VUE_INIT']) setTimeout(function () { watcher['VUE_INIT'](); }, 1);
                var ready = document.querySelectorAll('*[vui-name]').length > 0;
                if (ready) _vueReady();
                else {
                    timerReady = setInterval(function () {
                        var ready_ = document.querySelectorAll('*[vui-name]').length > 0;
                        if (ready_) {
                            clearInterval(timerReady);
                            _vueReady();
                        }
                    }, 200);
                }
            });
        }

        function vueReady() {
            var data = {}, props = '';
            //Object.keys(vueMixin.props).forEach(function (o, index) {
            //    if (o[o.length - 1] == 's') data[o] = [];
            //    else data[o] = '';
            //    props += ' :' + o + '="' + o + '" ';
            //});
            var el = document.querySelector('*[vui-name]');
            var key = el.getAttribute('vui-name');
            var template = '<' + key + props + '></' + key + '>';
            el.innerHTML = template;

            vueApp = new Vue({
                el: el,
                data: function () { return data; },
                mounted: function () {
                    Vue.nextTick(function () {
                        if (watcher['VUE_READY']) watcher['VUE_READY']();
                    });
                }
            });
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

        function vueGetTemplate(keyView) {
            var htm = '';
            if (vueTemps.hasOwnProperty(keyView)) htm = vueTemps[keyView];
            if (htm.length == 0) htm = '<div></div>';
            return htm;
        }

        //--------------------------------------------------------------------------------------------------

        function init(callback) {
            if (mIsIE) return console.error('Can not support browser IE');
            libSetup(function (rVal) {
                if (rVal.Ok) {
                    vueSetup(callback);
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