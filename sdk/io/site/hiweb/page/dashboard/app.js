﻿{
    data: function () {
        return {};
    },
    created: function () {

    },
    mounted: function () {
        var _self = this;
        console.log(3)
        $('.collapse').collapse();
    },
    methods: {
        login: function () {
            var _self = this;
            alert('login');
            _self.goPage('dashboard');
        }
    }
}