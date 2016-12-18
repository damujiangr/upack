/**
 * Created by damujiangr on 16/9/17.
 */
var gulp = require('gulp');
var gutil = require('gulp-util');

//本地模块
var ftp = require('./libs/ftp');
var css = require('./libs/css');
var cleaner = require('./common/cleaner');
var html = require('./libs/html');
var img = require('./libs/img');
var mock = require('./libs/mock');
var monitor = require('./libs/monitor');
var script = require('./libs/script');
var server = require('./libs/server');
var transfer = require('./libs/transfer');
var reversion = require('./libs/reversion');
var transformPath = require('./libs/transformPath');
var zip = require('./libs/zip');

//本地模块
var config = require('./config.json');

function rebuild() {
    gutil.log('+++++++++rebuild+++++++++');
    gulp.series(
        'buildCommon',
        transfer.transferTmpToTarget.bind(null, config.dev.dir),
        server.serverReload
    )();
}

gulp.task('delAll', gulp.parallel(
    cleaner.delTmp,
    cleaner.delDev,
    cleaner.delDist,
    cleaner.delBuild
));

gulp.task('buildCommon', gulp.series(
    html.compileUseref,
    html.compileTmpl,
    mock.copyMock,
    gulp.parallel(
        img.copyImg,
        img.copySlice,
        img.copyFonts,
        script.compileScript,
        css.compileSass
    ),
    css.addCssPrefixer
    )
);

/**
 * dev环境下的构建任务
 */
gulp.task('dev', gulp.series(
    'delAll',
    'buildCommon',
    transfer.transferTmpToTarget.bind(null, config.dev.dir),
    monitor.startMonitor.bind(null, rebuild),
    server.startServer.bind(null, config.dev.dir)
));

/**
 * 用于部署的开发环境构建任务
 */
gulp.task('dev-abs', gulp.series(
    'delAll',
    'buildCommon',
    transformPath.absoluteAndDomain,
    transfer.transferTmpToTarget.bind(null, config.dev.dir)
));

/**
 * 执行dev-tar，将dev代码部署测试环境之后启动的本地页面服务
 * 读取的是测试环境的资源，需要配host
 */
gulp.task('dev-abs-server', gulp.series(
    'dev-abs',
    server.startServer.bind(null, config.dev.dir)
));

/**
 * 用于部署的生产环境构建任务
 */
gulp.task('dist', gulp.series(
    'delAll',
    'buildCommon',
    gulp.parallel(
        html.compressHtml,
        css.compressCss,
        script.compressScript,
        img.compressImg
    ),
    reversion.reversion,
    transformPath.absoluteAndDomain,
    transfer.transferTmpToTarget.bind(null, config.dist.dir)
));

/**
 * 执行dist-tar，将dist代码部署测试环境后启用的本地页面服务
 * 读取为测试环境的资源，需要配host
 */
gulp.task('dist-server', gulp.series(
    'dist',
    server.startServer.bind(null, config.dist.dir)
));

/**
 * dev 部署
 */
gulp.task('dev-ftp', gulp.series(
    'dev-abs',
    ftp.remoteVftp.bind(null, config.dev)
));

/**
 * dist部署
 */
gulp.task('dist-ftp', gulp.series(
    'dist',
    ftp.remoteVftp.bind(null, config.dist)
));

/**
 * 同步SVN目录
 */
gulp.task('dist-svn', gulp.series(
    'dist',
    transfer.transferDistToSvn
));

/**
 * 仅用作测试部署，产出目录与线上根目录保持一致
 */
gulp.task('dev-tar', gulp.series(
    'dev-abs',
    transfer.transferOnlineFormat.bind(null, config.dev),
    zip.buildTar
));

/**
 * 部署时用到的命令，产出目录与线上根目录保持一致，Jenkins集成时同样使用此任务
 */
gulp.task('dist-tar', gulp.series(
    'dist',
    transfer.transferOnlineFormat.bind(null, config.dist),
    zip.buildTar
));
