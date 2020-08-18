{
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
}