/**
 * !dev开发环境下的构建任务文件
 * !import 特别注意，资源相对引用路径，不可以使用“./”
 */
//util
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var gulp = require('gulp');
var del = require('del');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
//html
var useref = require('gulp-useref');
var inlinesource = require('gulp-inline-source');
var tmpl2js = require('gulp-tmpl2js');
//js
var amdOpt = require('amd-optimize');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
//css img sprite
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var tmtsprite = require('gulp-tmtsprite');
var lazyImageCSS = require('gulp-lazyimagecss');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
//rev
var RevAll = require('gulp-rev-all');
var revDel = require('gulp-rev-delete-original');
//server reload
var browserSync = require('browser-sync').create();
var merge = require('merge-stream');
//config
var config = require('./config.json');

//清除 dev 目录
function delDev() {
    return del([config.dev.dir]);
}

//清除 tmp 目录
function delTmp() {
    return del([
      config.tmp.dir,
      'src/tmpl/**/*.js'
    ]);
}

/**
 * build html | end
 */
function doUseref() {
    return gulp.src(config.src.html, {
            base: 'src'
        })
        .pipe(useref({
            noAssets: true
        }))
        .pipe(inlinesource({
            compress: true
        }))
        .pipe(gulp.dest(config.tmp.dir));
}

//将模板转为js
function compileTmpl() {
    return gulp.src(config.src.tmpl)
        .pipe(tmpl2js({
            mode: 'format',
            wrap: 'amd'
        }))
        .pipe(gulp.dest('./src/tmpl/'));
}
/**
 * build html | end
 */

/**
 * build js | begin
 * esl-jquery要与useref保持一致
 */
function doJsLibs() {
    return gulp.src(['src/js/libs/esl.js', 'src/js/libs/jquery.js'])
        .pipe(concat('esl-jquery.js'))
        .pipe(gulp.dest(config.tmp.libs));
}

//pkg目录下的文件名即打包后的模块名
function doJsPkg() {
    var jsPkgMerge = merge();
    var files = fs.readdirSync(config.src.jsPkgDir);
    _.forEach(files, function (value, index) {
        var mod = _.replace(value, '.js', '');
        var stream = gulp.src(config.src.js)
        .pipe(plumber())
            .pipe(amdOpt(mod))
            .pipe(concat(value))
        .pipe(gulp.dest(config.tmp.js));
        jsPkgMerge.add(stream);
    });
    return jsPkgMerge;
}

/**
 * build js | end
 */

/**
 * build css | begin
 */
/**
 * Sass文件的打包编译
 * @return {[type]} [description]
 */
function doSassPkg() {
    return gulp.src(config.src.sass)
        .pipe(sass()).on('error', sass.logError)
        .pipe(gulp.dest(config.tmp.css));
}

//postcss的配置
var postcssConfig = [
        autoprefixer({
            browsers: ['last 5 versions']
        })
    ];
    /**
     * 自动添加前缀，需要配置postcssConfig
     * @return {[type]} [description]
     */
function doCssAutoprefixer() {
    return gulp.src('./tmp/css/pkg/*.css')
        .pipe(postcss(postcssConfig))
        .pipe(gulp.dest('./tmp/css/pkg/'));
}
/**
 * build css | end
 */
/**
 * build img | begin
 */
function copyImg() {
    return gulp.src(config.src.img)
        .pipe(gulp.dest(config.tmp.img));
}

function copySlice() {
    return gulp.src(config.src.slice)
        .pipe(gulp.dest(config.tmp.slice));
}
/**
 * build img | end
 */

/**
 * build other | begin
 */
function copyMock() {
    return gulp.src(config.src.mock)
        .pipe(gulp.dest(config.tmp.mock));
}

function transfer() {
    return gulp.src('./tmp/**/*', {
            base: 'tmp'
        })
        .pipe(gulp.dest(config.dev.dir))
        .on('end', function() {
            delTmp();
        });
}

//启动服务
//mock对ajax的拦截和browser-sync/socket.io冲突
function startServer() {
    browserSync.init({
        server: 'dev',
        startPath: 'html/index-pc.html',
        reloadDelay: 1000,
        open: 'local'// local external
    });
}

//监听变化，必须添加cb
function startMonitor(callback) {
    var watcher = gulp.watch([
        'src/html/**/*.html',
        'src/js/**/*.js',
        'src/sass/**/*.scss',
        'src/tmpl/**/*.html'
    ], {
        ignored: /[\/\\]\./
    });

    //TODO 事件列表
    watcher.on('change', function(file) {
            gutil.log(file + ' has been changed');
            rebuild(reload);
        })
        .on('add', function(file) {
            gutil.log(file + ' has been added');
            rebuild(reload);
        })
        .on('unlink', function(file) {
            gutil.log(file + ' is deleted');
            rebuild(reload);
        });

    callback();
}

//reload
function reload() {
    gutil.log('reloaded!');
    browserSync.reload();
}

var rebuildTime = 1000; //毫秒
var rebuildTimeId;

//TODO 需要优化changed
function rebuild(callback) {
    clearTimeout(rebuildTimeId);
    rebuildTimeId = setTimeout(function() {
        gulp.series(
            doUseref,
            compileTmpl,
            gulp.parallel(
                doJsPkg,
                doSassPkg
            ),
            doCssAutoprefixer,
            transfer,
            callback
        )();
    }, rebuildTime);
}
/**
 * build other | end
 */

/**
 * dev环境下的构建任务
 */
gulp.task('dev', gulp.series(
    delTmp,
    delDev,
    doUseref,
    compileTmpl,
    copyMock,
    gulp.parallel(
        copyImg,
        copySlice,
        doJsLibs,
        doJsPkg,
        doSassPkg
    ),
    doCssAutoprefixer,
    transfer,
    startMonitor,
    startServer
));

/**
 * 用于部署的开发环境构建任务
 */
gulp.task('dev-build', gulp.series(
    delTmp,
    delDev,
    doUseref,
    compileTmpl,
    copyMock,
    gulp.parallel(
        copyImg,
        copySlice,
        doJsLibs,
        doJsPkg,
        doSassPkg
    ),
    doCssAutoprefixer,
    'cdn',
    transfer
));
