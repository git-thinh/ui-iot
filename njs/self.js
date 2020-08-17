
module.exports = {
    yyMMddHHmmss: function () {
        const d = new Date();
        const id = d.toISOString().slice(-24).replace(/\D/g, '').slice(2, 8) + '' +
            d.toTimeString().split(' ')[0].replace(/\D/g, '') + '';
        return id;
    },
    uuid: function () {
        return 'xxxxxxxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    guid: function (schema) {
        schema = schema || '';
        const prefix = (schema.length == 0 ? '' : schema + '|') + ___yyMMddHHmmss() + '|';
        let id = ___uuid();
        return id;
    },
    convertUnicodeToAscii: function (str) {
        if (str == null || str.length == 0) return '';
        try {
            str = str.trim();
            if (str.length == 0) return '';

            var AccentsMap = [
                "aàảãáạăằẳẵắặâầẩẫấậ",
                "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
                "dđ", "DĐ",
                "eèẻẽéẹêềểễếệ",
                "EÈẺẼÉẸÊỀỂỄẾỆ",
                "iìỉĩíị",
                "IÌỈĨÍỊ",
                "oòỏõóọôồổỗốộơờởỡớợ",
                "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
                "uùủũúụưừửữứự",
                "UÙỦŨÚỤƯỪỬỮỨỰ",
                "yỳỷỹýỵ",
                "YỲỶỸÝỴ"
            ];
            for (var i = 0; i < AccentsMap.length; i++) {
                var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
                var char = AccentsMap[i][0];
                str = str.replace(re, char);
            }

            str = str
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D");

            str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
            str = str.replace(/ + /g, " ");

            str = str.toLowerCase();

        } catch (err_throw) {
            ___log_err_throw('___convert_unicode_to_ascii', err_throw, str);
        }

        return str;
    },
    schemaGetConfig: function (schema) {
        try {
            const file = __dirname + '/index/' + schema + '.json';
            if (fs.existsSync(file)) {
                const obj = require('./index/' + schema + '.json');
                console.log(obj);
                return obj;
            }
        } catch (err) { ; }
        return { "file_key": schema + "|{{___id}}" };
    }
};