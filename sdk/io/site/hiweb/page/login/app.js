_ioUI_appInit = function () {
    var id = mIOKeyAttr + '-page-' + mIOUiCurrentPage;
    console.log(id);

    _ioUI_vueApp = new Vue({
        mixins: [_ioUI_vueMixinApp],
        el: '#' + id,
        data: function () {
            return {};
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
};