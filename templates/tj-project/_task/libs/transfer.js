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
    return gulp.src(path.join(config.tmp.dir, '**/*'), {
            base: config.tmp.dir
        })
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
        var stream = gulp.src(src.static, {base: src.base, buffer: false})
            .pipe(gulp.dest(path.join(config.svn.basePath, src.remotePath)));
        mergeStream.add(stream);
    }
    return mergeStream;
}

exports.transferTmpToTarget = transferTmpToTarget;
exports.transferDistToSvn = transferDistToSvn;