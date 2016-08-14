'use strict';

var path = require('path');
var fs = require('graceful-fs');
var fse = require('fs-extra');
var jsonfile = require('jsonfile');

var upack = require('../upack');
/**
 * 初始化组件配置＋目录结构
 * @param  {[object]} options [命令行参数]
 * @param  {[object]} config  [组件配置参数]
 * @return {[type]}         [description]
 */
module.exports = function(options, config) {
    var cwd = path.resolve(upack.root);
    var componentJson = path.join(upack.root, 'component.json');
    var readme = path.join(upack.root, 'README.md');
    var content = '# ' + config.name + '\n' + config.description + '\n';

    config.dependencies = [];
    config.devDependencies = [];
    config.exclude = ['docs', 'examples', 'test', 'README.md'];
    //component.json
    jsonfile.writeFileSync(componentJson, config, {
        spaces: 2
    });

    if (options.component) {
        //readme
        // fs.writeFileSync(readme, content);
        //templates
        fse.copySync(path.join(__dirname, '../../templates/component/'), cwd);
    }else if(options.project){
      //templates
      fse.copySync(path.join(__dirname, '../../templates/tj-project/'), cwd);
    }
    return upack.async(config);
};
