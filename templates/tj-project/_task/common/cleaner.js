/**
 * Created by damujiangr on 16/9/17.
 */
var path = require('path');

var del = require('del');

//本地模块
var config = require('./../config.json');


//清除 tmp 目录和模板文件转化为JS的 临时文件
function delTmp() {
    return del([
        config.tmp.dir,
        path.join(config.tmp.tmpl, '/**/*.js')
    ]);
}

//清除 dev 目录
function delDev() {
    return del([config.dev.dir]);
}

//清除 dist 目录
function delDist() {
    return del([config.dist.dir]);
}


exports.delTmp = delTmp;
exports.delDev = delDev;
exports.delDist = delDist;