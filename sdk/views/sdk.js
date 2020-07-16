var IO = (function () {
    function UIEngine(options) {
        options = options || {};
        var _ID = new Date().getTime();

        var _vue = {
            app: null,
            temps = {},
            coms =[],
            regType = {},
            mixin = {}
        };

        var _app = {
            init: function () { }
        }

        return {
            init: _app.init(),
            Vue: {
                App: _vue.app,
                Mixin: _vue.mixin
            }
        }
    }

    var instance;
    return { getInstance: function (options) { if (instance === undefined) { instance = new UIEngine(options); } return instance; } };
})().getInstance();
IO.init();