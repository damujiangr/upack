/**
 * 将资源文件通过FTP上传
 *
 * CDN资源定制
 * 1. static 用于存放JS/CSS文件 /static.58.com
 * 2. pic2 用于存放IMG文件 /pic2.58.com
 * 3. webfonts,因为字体会跨域,需要放到指定的目录中 /pic2.58.com/webfonts
 *
 * Created by damujiangr on 16/9/17.
 */

var path = require('path');

var gulp = require('gulp');
var gutil = require('gulp-util');
var vFtp = require('vinyl-ftp');
var merge = require('merge-stream');

//本地模块
var ftpPath = require('./../util/ftpPath');
var config = require('./../config.json');

/**
 * 静态资源上传FTP
 * @param buildDir
 */
function remoteVftp(buildDir) {
    //获取路径
    var deployConf = ftpPath.getDeployPath(buildDir);

    //创建FTP连接
    var conn = vFtp.create(config.ftp);

    //创建merge工作流
    var mergeStream = merge();
    var sources = deployConf.sources;
    for (var i = 0, len = sources.length; i < len; i++) {
        var src = sources[i];
        var input = src.static;
        var output = src.remotePath;
        var stream = gulp.src(input, {base: src.base, buffer: false})
        // .pipe(conn.newer(src.remotePath)) // only upload newer files
            .pipe(conn.dest(output))
            .on('end', function (input, output) {
                gutil.log('上传测试环境：[' + input + '] ==> 上传到IP：' + config.ftp.host + ' 的FTP目录：' + output);
            }.bind(null, input, output));
        mergeStream.add(stream);
    }
    return mergeStream;
}

/**
 * 将build目录整体上传
 */
function remoteVftpBuild(){
    //创建FTP连接
    var conn = vFtp.create(config.ftp);
    var input = path.join(config.build.dir, '**/*');
    var output ='/';
    return gulp.src(input, {base: config.build.dir, buffer: false})
        .pipe(conn.dest(output))
        .on('end', function (input, output) {
            gutil.log('上传测试环境：[' + input + '] ==> 上传到IP：' + config.ftp.host + ' 的FTP目录：' + output);
        }.bind(null, input, output));
}

exports.remoteVftp = remoteVftp;
exports.remoteVftpBuild = remoteVftpBuild;
