'use strict';

var path = require('path');
var fs = require('fs');

var jsonfile = require('jsonfile');

var upack = require('../upack');

module.exports = function(config) {
    var packageJson = path.join(upack.root, 'package.json');
    var packageCfg = {};

    //判断package.json文件是否存在
    if (fs.existsSync(packageJson)) {
        packageCfg = jsonfile.readFileSync(packageJson);
        packageCfg.name = config.name;
        packageCfg.description = config.description;
        packageCfg.author = config.author;
        jsonfile.writeFileSync(packageJson, packageCfg, {
            spaces: 2
        });
        upack.logger.info(upack.i18n('CREATE_PACKAGE_JSON'));
    }
};
