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

var gulp = require('gulp');
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
        var stream = gulp.src(src.static, {base: src.base, buffer: false})
            .pipe(conn.newer(src.remotePath)) // only upload newer files
            .pipe(conn.dest(src.remotePath));
        mergeStream.add(stream);
    }
    return mergeStream;
}

exports.remoteVftp = remoteVftp;
