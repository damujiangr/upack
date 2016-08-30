var path = require('path');
var url = require('url');
var gulp = require('gulp');
var gutil = require('gulp-util');
//cdn
var replace = require('gulp-replace');
var config = require('./config.json');

var projectName = config['ftp']['projectName'] || process.cwd().split(path.sep).pop();
var basePath = config['ftp']['basePath'] || 'tj-test';
/**
 * CDN替换
 */
function cdnReplace() {
    var source = path.join(config.tmp.dir, '/**/*');
    var js = url.resolve('http://j1.cdn.58.com/', path.join(basePath, projectName, 'js/'));
    var css = url.resolve('http://c.cdn.58.com/', path.join(basePath, projectName, 'css/'));
    var slice = url.resolve('http://img.cdn.58.com/', path.join(basePath, projectName, 'slice/'));
    var sprite = url.resolve('http://img.cdn.58.com/', path.join(basePath, projectName, 'sprite/'));

    return gulp.src([source])
        .pipe(replace('../js/', js))
        .pipe(replace('../css/', css))
        .pipe(replace('../../slice/', slice))
        .pipe(replace('../../sprite/', sprite))
        .pipe(gulp.dest(config.tmp.dir));
}

gulp.task('cdn', gulp.parallel(
    cdnReplace
));