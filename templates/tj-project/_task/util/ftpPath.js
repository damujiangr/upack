/**
 * Created by damujiangr on 16/9/18.
 */
var path = require('path');
var _ = require('lodash');

//本地模块
var config = require('./../config.json');

/**
 * 获取本地路径
 * @param buildDir
 * @returns {{projectName: T, basePath, sources}}
 */
function getDeployPath(buildDir) {
    //默认取工程目录名称
    var projectName = config['deploy']['projectName'] || process.cwd().split(path.sep).pop();
    //默认取天玑项目的测试目录名称
    var basePath = config['deploy']['basePath'];

    var sources = config['deploy']['sources'];

    //全部文件的省略路径
    var allFile = '/**/*';

    //对部署路径做出处理
    for (var i = 0, len = sources.length; i < len; i++) {
        var src = sources[i];
        //base路径
        src.base = buildDir.dir;
        src.static = [];
        var dirs = src.dirs;
        //dirs路径
        for (var j = 0, jLen = dirs.length; j < jLen; j++) {
            src.static.push(path.join(buildDir[dirs[j]], allFile));
        }
        //remote
        src.remotePath = path.join(src.remote, basePath, projectName);
    }
    return {
        "projectName": projectName,
        "basePath": basePath,
        "sources": sources
    }
}

exports.getDeployPath = getDeployPath;