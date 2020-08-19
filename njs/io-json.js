const PORT = process.env.PORT;
//const PORT = 8586;
const HTTP = require('http');

const PATH = require('path');
const _FS = require('fs');

function responseWrite(data, response) {
    data = data || '';
    if (typeof data == 'object') data = JSON.stringify(data);
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    response.write(data, 'utf-8');
    response.end();
}


function writeModuleInfo(rootFolder, callback) {
    let arrItems = [];

    const pathRoot = PATH.join(__dirname, '../sdk/io/');
    const path = PATH.join(pathRoot, rootFolder);
    console.log(path)

    _FS.readdir(path, function (err, scopes) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //console.log(scopes);
        scopes.forEach(function (scope, indexScope) {
            if (scope.indexOf('.') === -1) {
                const pathScope = PATH.join(path, scope);
                _FS.readdir(pathScope, function (er2, items) {
                    if (er2) {
                        return console.log('Unable to scan directory: ' + er2);
                    }
                    //console.log(items);
                    items.forEach(function (item, indexItem) {
                        if (item.indexOf('.') === -1) {
                            const pathItem = PATH.join(pathScope, item);
                            const files = _FS.readdirSync(pathItem);

                            const o = {
                                "Enable": true,
                                "Root": rootFolder,
                                "Scope": scope.toLowerCase(),
                                "Name": item.toLowerCase(),
                                "Key": rootFolder + '_' + scope.toLowerCase() + '_' + item.toLowerCase(),
                                "Title": "",
                                "Error": "",
                                "Files": files,
                                "Setting": {
                                    "Active": false,
                                    "Title": "",
                                    "Screen": "",
                                    "Groups": [],
                                    "Actions": []
                                }
                            };
                            arrItems.push(o);
                        }

                        if (indexScope == scopes.length - 1 && indexItem == items.length - 1) {
                            //console.log('OK = ', arrItems);
                            if (callback) return callback(arrItems);
                        }
                    });
                });
            }
        });
    });
}

function init(callback) {
    const p1 = new Promise((resolve, reject) => {
        writeModuleInfo('kit', function (a) { resolve(a); });
    });

    const p2 = new Promise((resolve, reject) => {
        writeModuleInfo('widget', function (a) { resolve(a); });
    });

    Promise.all([p1, p2]).then(function (arrs) {
        var a = [];
        if (arrs[0]) arrs[0].forEach(function (o) { a.push(o); });
        if (arrs[1]) arrs[1].forEach(function (o) { a.push(o); });
        //console.log(a.length);
        const file = PATH.join(__dirname, '../sdk/io/list.json');
        _FS.writeFile(file, JSON.stringify(a), 'utf8', function (err) {
            if (err) {
                console.log('ER = ', err);
            } else {
                console.log('OK = ', file, arrs.length);
            }
        });
        if (callback) callback(a);
    });
}

init(function (arrs) {});

HTTP.createServer(function (request, response) {
    init(function (arrs) {
        responseWrite(arrs, response);
    });
}).listen(PORT);
