console.log('global.js!!!!!!!!!!');

_io_getData = function() {
    var settingApp = _io_getSettingApp();
    mIOData.Setting.App = settingApp;
    return mIOData;
}

_io_getSettingApp = function () {
    var arr = [], _self;
    if (typeof window == "undefined") _self = self; else _self = window;
    arr = _self['mIOVarGlobalArray'];
    var obj = {};
    arr.forEach(function (key) {
        if (key[0] != '_' && key != 'mIOData' && key != 'mIOChannel') {
            obj[key] = _self[key];
        }
    });
    return obj;
}


var getParameterByName = function (name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

function numberToByteArray(number, size) {
    size = size || 8;
    var byteArray = [];
    for (var i = 0; i < size; i++) byteArray.push(0);

    for (var index = 0; index < byteArray.length; index++) {
        var byte = number & 0xff;
        byteArray[index] = byte;
        number = (number - byte) / 256;
    }

    return byteArray;
};

function byteArrayToLong(/*byte[]*/byteArray) {
    var value = 0;
    for (var i = byteArray.length - 1; i >= 0; i--) {
        value = (value * 256) + byteArray[i];
    }
    return value;
};