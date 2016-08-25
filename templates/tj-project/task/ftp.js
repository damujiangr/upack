var path = require('path');
var gulp = require('gulp');
var _ = require('lodash');
var config = require('./config.json');
var vFtp = require('vinyl-ftp');
var merge = require('merge-stream');

/**
 * 1.static
 * 2.pic2
 * 3.webfonts,因为字体会跨域,需要放到指定的目录中 TODO
 * 4.相对路径修改为绝对路径,加入CDN修改 TODO
 */
function remoteFtp() {
    //默认取工程目录名称
    var projectName = config['ftp']['projectName'] || process.cwd().split(path.sep).pop();
    var remoteStaticPath = config['ftp']['remoteStaticPath'] || "";
    var remotePic2Path = config['ftp']['remotePic2Path'] || "";
    var ftpConfig = _.extend(config['ftp'], {
        "remoteStaticPath": path.join(remoteStaticPath, projectName),
        "remotePic2Path": path.join(remotePic2Path, projectName)
    });

    var conn = vFtp.create(ftpConfig);

    //TODO 产出目录的glob
    var distStatic = [
        './dist/html/**/*',
        './dist/js/**/*',
        './dist/css/**/*'
    ];
    var distPic = [
        './dist/img/**/*',
        './dist/sprite/**/*'
    ];

    var staticStream = gulp.src(distStatic, {base: './dist', buffer: false})
        .pipe(conn.newer(ftpConfig.remoteStaticPath)) // only upload newer files
        .pipe(conn.dest(ftpConfig.remoteStaticPath));

    var pic2Stream = gulp.src(distPic, {base: './dist', buffer: false})
        .pipe(conn.newer(ftpConfig.remotePic2Path)) // only upload newer files
        .pipe(conn.dest(ftpConfig.remotePic2Path));

    return merge(staticStream, pic2Stream);
}

//real deploy
//首先执行 dist 任务
gulp.task('deploy', gulp.series(
    'dist-deploy',
    remoteFtp
));
