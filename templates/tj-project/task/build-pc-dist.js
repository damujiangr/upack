/**
 * dist环境下的构建任务文件
 * !import 特别注意，资源相对引用路径，不可以使用“./” 尤其是对rev
 */
//util
var path = require('path');
var gulp = require('gulp');
var del = require('del');
var gulpif = require('gulp-if');
var tap = require('gulp-tap');
var gutil = require('gulp-util');
//html
var useref = require('gulp-useref');
var htmlmin = require('gulp-htmlmin');
var inlinesource = require('gulp-inline-source');
//js
var amdOpt = require('amd-optimize');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
//css img sprite
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('gulp-cssnano');
var tmtsprite = require('gulp-tmtsprite');
var lazyImageCSS = require('gulp-lazyimagecss');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
//rev
var RevAll = require('gulp-rev-all');
var revDel = require('gulp-rev-delete-original');
//server reload
var browserSync = require('browser-sync').create();
//config
var config = require('./config.json');

//清除 dist 目录
function delDist() {
    return del([config.dist.dir]);
}

//清除 tmp 目录
function delTmp() {
    return del([config.tmp.dir]);
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
        .pipe(inlinesource())
        .pipe(gulp.dest(config.tmp.dir));
}

function doMinHtml() {
    return gulp.src('./tmp/html/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(config.tmp.html));

}
/**
 * build html | end
 */

/**
 * build js | begin
 * ［important］要与html中的useref保持一致
 */
function doJsLibs() {
    return gulp.src(['src/js/libs/esl.js', 'src/js/libs/jquery.js'])
        .pipe(concat('esl-jquery.js'))
        .pipe(uglify({
            // preserveComments: 'all',
            mangle: false
        }))
        .pipe(gulp.dest(config.tmp.libs));
}

//需要amdOpt(<模块名>) 中的模块名与pkg目录下的名字一致
//pkg目录下的文件名即打包后的模块名
function doJsPkg() {
    return gulp.src(config.src.js)
        .pipe(tap(function(file, t) {
            var filePath = file.path;
            var modName = path.basename(filePath, '.js');
            gulp.src(filePath)
                .pipe(amdOpt(modName, {
                    paths: {
                        'mock': 'node_modules/mockjs/dist/mock',
                        'mock-api': 'src/mock/api'
                    },
                }))
                .pipe(concat(modName + '.js'))
                .pipe(uglify({
                    // preserveComments: 'all',
                    mangle: false
                }))
                .pipe(gulp.dest(config.tmp.js));
        }))
        .pipe(gulp.dest(config.tmp.js));
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
        .pipe(lazyImageCSS({
            imagePath: ['../../slice'],
            width: true,
            height: true
        }))
        .pipe(tmtsprite({
            margin: 4,
            slicePath: '../../slice'
        }))
        .pipe(gulpif('*.png', gulp.dest(config.tmp.sprite), gulp.dest(config.tmp.css)));
}

function doMinCss() {
    return gulp.src('./tmp/css/pkg/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest(config.tmp.css));
}

//postcss的配置
var postcssConfig = [
        autoprefixer({
            browsers: ['last 5 versions']
        })
    ]
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
function compressImg() {
    return gulp.src(config.src.img)
        .pipe(imagemin({
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.tmp.img));
}

function compressSprite() {
    return gulp.src('./tmp/sprite/**/*')
        .pipe(imagemin({
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.tmp.sprite));
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
        .pipe(gulp.dest(config.dist.dir))
        .on('end', function() {
            delTmp();
        });
}

//启动服务
function startServer() {
    browserSync.init({
        server: './dist',
        startPath: './html/index-a.html',
    });
}

//文件名添加MD5
//import 特别注意，资源相对引用路径，不可以使用./
function reversion() {
    var revAll = new RevAll({
        fileNameManifest: 'manifest.json',
        dontRenameFile: ['.html', '.css', '.js'],
        dontUpdateReference: ['.html', '.css', '.js']
    });

    return gulp.src(['tmp/**/*'])
        .pipe(revAll.revision())
        .pipe(gulp.dest(config.tmp.dir))
        // .pipe(revDel({exclude: /(.html|.htm)$/}))
        .pipe(revDel())
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest(config.tmp.dir));
}

//TODO 监听变化
function startMonitor(callback) {
    var watcher = gulp.watch([
        'src/**/*'
    ], {
        ignored: /[\/\\]\./
    });

    //TODO 事件列表
    watcher.on('change', function(file) {
            gutil.log(file + ' has been changed');
            rebuild(browserSync.reload);
        })
        .on('add', function(file) {
            gutil.log(file + ' has been added');
            rebuild(browserSync.reload);
        })
        .on('unlink', function(file) {
            gutil.log(file + ' is deleted');
            rebuild(browserSync.reload);
        });

    callback();
}

//优化重新构建的事件，加入changed
//TODO 暂时先和dist保持同步
function rebuild(callback) {
    gulp.series(
        delTmp,
        delDist,
        doUseref,
        gulp.parallel(
            copyMock,
            doJsLibs,
            doJsPkg,
            doSassPkg,
            compressImg
        ),
        compressSprite,
        doCssAutoprefixer,
        doMinHtml,
        // doMinJs,//todo 单独提出来
        doMinCss,
        reversion,
        transfer,
        callback
    )();
}
/**
 * build other | end
 */

/**
 * dist环境下的构建任务
 */
gulp.task('dist', gulp.series(
    delTmp,
    delDist,
    doUseref,
    gulp.parallel(
        copyMock,
        doJsLibs,
        doJsPkg,
        doSassPkg,
        compressImg
    ),
    compressSprite,
    doCssAutoprefixer,
    doMinHtml,
    // doMinJs,//TODO 单独提出来
    doMinCss,
    reversion,
    transfer,
    startMonitor,
    startServer
));
