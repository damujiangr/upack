/**
 * Created by ramboyan on 16/12/8 下午5:15.
 */
var path = require('path');
var gulp = require('gulp');
var gzip = require('gulp-gzip');
var tar = require('gulp-tar');

var config = require('./../config.json');
var packageConfig = require('./../../package.json');

/**
 * @returns {*}
 */
function buildTar() {
    return gulp.src(path.join(config.build.dir, '**/*'))
        .pipe(tar(packageConfig.name + '.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('./'));
}

exports.buildTar = buildTar;