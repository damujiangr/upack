/**
 * Created by damujiangr on 2016/10/15.
 */
var path = require('path');

var gulp = require('gulp');
var RevAll = require('gulp-rev-all');
var revDel = require('gulp-rev-delete-original');

var config = require('./../config.json');

//文件名添加MD5
//import 特别注意，资源相对引用路径，不可以使用./
//dontRenameFile: ['.html', '.js', '.css']
//dontUpdateReference: ['.html', '.js', '.css']
function reversion() {
    var revAll = new RevAll({
        fileNameManifest: 'manifest.json',
        dontRenameFile: ['.html', '.js', '.css'],
        dontUpdateReference: ['.html', '.js', '.css']
    });

    return gulp.src([path.join(config.tmp.dir, '**/*')])
        .pipe(revAll.revision())
        .pipe(gulp.dest(config.tmp.dir))
        .pipe(revDel())
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest(config.tmp.dir));
}

exports.reversion = reversion;