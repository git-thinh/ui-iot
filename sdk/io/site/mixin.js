
_ioUI_vueMixinGlobal = {
    computed: {
        _Element: function () {
            var _self = this;
            var el = _self.$el;
            return el;
        },
        _KeyName: function () {
            var _self = this;
            var key;
            if (_self.$vnode && _self.$vnode.componentOptions && _self.$vnode.componentOptions.tag)
                key = _self.$vnode.componentOptions.tag;
            return key;
        },
        _PageId: function () {
            return mIOKeyAttr + '-page-' + mIOUiCurrentPage;
        }
    },
    mounted: function () {
        var _self = this;
        //console.log(1)
        var el = _self.$el;
        if (el) {
            var keyName = _self._KeyName;
            if (keyName) {
                //el.setAttribute(mIOKeyAttr + '-key', keyName);
                classie.add(el, keyName);
            }
        }
    },
    methods: {
        cacheUpdate: _io_cacheUpdate,
        responseFetch: _io_responseFetch,
        requestFetch: _io_requestFetch,
        requestGet: _io_requestGet,
        requestGetArray: _io_requestGetArray,

        linkCssInsertHeader: _ioUI_linkCssInsertHeader,
        linkCssInsertHeaderArray: _ioUI_linkCssInsertHeaderArray,
        scriptInsertHeader: _ioUI_scriptInsertHeader,
        scriptInsertHeaderArray: _ioUI_scriptInsertHeaderArray,

        commitEvent: _ioUI_commitEvent,
        goPage: _ioUI_pageGo,

        registerEvent: function (type, pCallback) {
            var _self = this;
            var keyName = _self._KeyName;
            mEventArray.push({ type: type, key: keyName, callback: pCallback });
        },
        textGet: function (keyText) {
            return '123';
        },

        //-----------------------------------------------

        _menuHeadingGet: function () {
            var a = [];
            if (mIOUiMenu && mIOUiMenu.groups) {
                Object.keys(mIOUiMenu.groups).forEach(function (key) {
                    var group = mIOUiMenu.groups[key];
                    debugger;
                    if (group != null && group.Heading != null && group.Visible == true)
                        a.push(mIOUiMenu.groups[key].Heading);
                });
            }
            if (a.length > 0) a = _.uniq(a);
            return a;
        },
        _menuGroupGetByHeading: function (heading) {
            var _self = this;
            var a = [];
            if (mIOUiMenu && mIOUiMenu.groups) {
                Object.keys(mIOUiMenu.groups).forEach(function (key) {
                    var group = mIOUiMenu.groups[key];
                    debugger;
                    if (group && group.Heading == heading && group.Visible == true) {
                        var o = mIOUiMenu.groups[key];
                        o.Key = key;
                        o.PageArray = _self._menuPageGetByGroup(key);
                        o.HasChild = o.PageArray > 0;
                        a.push(o);
                    }
                });
            }
            return a;
        },
        _menuPageGetByGroup: function (group) {
            var a = [];
            if (mIOUiMenu && mIOUiMenu.menus) {
                Object.keys(mIOUiMenu.menus).forEach(function (key) {
                    if (mIOUiMenu.menus[key] && mIOUiMenu.menus[key].Group === group) {
                        var o = mIOUiMenu.menus[key];
                        o.Key = key;
                        a.push(o);
                    }
                });
            }
            return a;
        }
    }
};

_ioUI_vueMixinApp = {
    mixins: [_ioUI_vueMixinGlobal],
    props: ['id', 'text', 'item', 'items'],
    computed: {
    },
    mounted: function () {
        var _self = this;
        //var id = mIOKeyAttr + '-page-' + mIOUiCurrentPage;
        //console.log(2)
        //setTimeout(function () {
        var el = document.getElementById(_self._PageId);
        if (el) {
            //el.style.display = 'inline-block';
            el.style.opacity = 1;
        }
        //}, 1000);
    },
    methods: {
    }
};

_ioUI_vueMixinCom = {
    mixins: [_ioUI_vueMixinGlobal],
    props: ['id', 'text', 'item', 'items'],
    computed: {
    },
    mounted: function () {
    },
    methods: {
    }
};