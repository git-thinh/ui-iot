{
    data: function () {
        return {
            Message: ''
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
            _ioUI_userLogin(function () {
                if (mIOData.User.Logined) {
                    if (mIODebugger) debugger;
                    location.href = '/';
                } else {
                    //_ioUI_pageGo('dashboard');
                    _self.Message = 'Username or Password is not correct. Please try again!'
                }
            });            
        }
    }
}