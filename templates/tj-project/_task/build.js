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
    cleaner.delDist
));

gulp.task('buildCommon', gulp.series(
    html.compileUseref,
    html.compileTmpl,
    mock.copyMock,
    gulp.parallel(
        img.copyImg,
        img.copySlice,
        script.compileScript,
        css.compileSass
    ),
    css.addCssPrefixer
    )
);

/**
 * 监听和服务
 * @returns {*}
 */
gulp.task('monitorAndServer', gulp.series(
    monitor.startMonitor.bind(null, rebuild),
    server.startServer
    )
);
// }

/**
 * dev环境下的构建任务
 */
gulp.task('dev', gulp.series(
    'delAll',
    'buildCommon',
    transfer.transferTmpToTarget.bind(null, config.dev.dir),
    'monitorAndServer'
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


//real deploy
//首先执行 dist 任务
gulp.task('dev-dep', gulp.series(
    'dev-abs',
    ftp.remoteVftp.bind(null, config.dev)
));


/**
 * dist部署
 */
gulp.task('dist-dep', gulp.series(
    'dist',
    ftp.remoteVftp.bind(null, config.dist)
));

/**
 * SVN复制
 */
gulp.task('dist-svn', gulp.series(
    'dist',
    transfer.transferDistToSvn
));
