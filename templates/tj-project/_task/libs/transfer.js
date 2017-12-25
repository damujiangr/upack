/**
 * Created by damujiangr on 16/9/17.
 */
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var merge = require('merge-stream');

//本地模块
var config = require('./../config.json');
var cleaner = require('./../common/cleaner');
var ftpPath = require('./../util/ftpPath');

/**
 * 将临时目录的内容移动到dev目录中
 * @param option
 * @returns {*}
 */
function transferTmpToTarget(option) {
    return gulp.src(path.join(config.tmp.dir, '**/*'), {base: config.tmp.dir})
        .pipe(gulp.dest(option))
        .on('end', function () {
            cleaner.delTmp();
        });
}

/**
 * 静态资源复制到上线的SVN目录中
 */
function transferDistToSvn() {
    //获取路径
    var deployConf = ftpPath.getDeployPath(config.dist);

    //创建merge工作流
    var mergeStream = merge();
    var sources = deployConf.sources;
    for (var i = 0, len = sources.length; i < len; i++) {
        var src = sources[i];
        var input = src.static;
        var output = path.join(config.svn.basePath, src.remotePath);
        var stream = gulp.src(input, {base: src.base, buffer: false})
            .pipe(gulp.dest(output))
            .on('end', function (input, output) {
                gutil.log('同步文件：[' + input + '] ==> 复制到上线SVN目录：' + output);
            }.bind(null, input, output));
        mergeStream.add(stream);
    }
    return mergeStream;
}

/**
 * 静态资源按照CDN根目录放置
 */
function transferOnlineFormat(conf) {
    //获取路径
    var deployConf = ftpPath.getDeployPath(conf);

    //创建merge工作流
    var mergeStream = merge();
    var sources = deployConf.sources;
    for (var i = 0, len = sources.length; i < len; i++) {
        var src = sources[i];
        var input = src.static;
        var output = path.join(config.build.dir, src.remotePath);
        var stream = gulp.src(input, {base: src.base, buffer: false})
            .pipe(gulp.dest(output))
            .on('end', function (input, output) {
                gutil.log('同步目录：[' + input + '] ==> 复制到目录：' + output);
            }.bind(null, input, output));
        mergeStream.add(stream);
    }
    return mergeStream;
}

/**
 * 将build目录整体同步到SVN中
 */
function transferBuildToSvn(){
    var input = path.join(config.build.dir, '**/*');
    var output = config.svn.basePath;
    return gulp.src(input, {base: config.build.dir, buffer: false})
        .pipe(gulp.dest(output))
        .on('end', function (input, output) {
            gutil.log('同步文件：[' + input + '] ==> 复制到上线SVN目录：' + output);
        }.bind(null, input, output));
}

exports.transferTmpToTarget = transferTmpToTarget;
exports.transferDistToSvn = transferDistToSvn;
exports.transferOnlineFormat = transferOnlineFormat;
exports.transferBuildToSvn = transferBuildToSvn;