var path = require('path');
var url = require('url');
var gulp = require('gulp');
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
    var js = url.resolve('http://j1.58cdn.com.cn/', path.join(basePath, projectName, 'js/'));
    var css = url.resolve('http://c.58cdn.com.cn/', path.join(basePath, projectName, 'css/'));
    var img = url.resolve('http://img.58cdn.com.cn/', path.join(basePath, projectName, 'img/'));
    var slice = url.resolve('http://img.58cdn.com.cn/', path.join(basePath, projectName, 'slice/'));
    var sprite = url.resolve('http://img.58cdn.com.cn/', path.join(basePath, projectName, 'sprite/'));

    return gulp.src([source])
        .pipe(replace('../js/', js))
        .pipe(replace('../css/', css))
        .pipe(replace('../../slice/', slice))
        .pipe(replace('../../img/', img))
        .pipe(replace('../../sprite/', sprite))
        .pipe(gulp.dest(config.tmp.dir));
}

gulp.task('cdn', gulp.parallel(
    cdnReplace
));