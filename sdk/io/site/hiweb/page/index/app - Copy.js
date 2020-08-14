function io_page_index() {
    var app = new Vue({
        mixins: [_ioUI_vueMixinApp],
        el: '#io-page-index',

        data: function () {
            return {
                PageArray: [{ Code: 'index' }, { Code: 'dashboard' }, { Code: 'login' }]
            };
        },
        created: function () {

        },
        mounted: function () {
            var _self = this;
            console.log(3)
        },
        methods: {
            login: function () {
                var _self = this;
                _ioUI_pageGo('dashboard');
            }
        }

    });
    return app;
}