/**
 * Created by ramboyan on 16/12/8 下午5:15.
 */
var path = require('path');
var gulp = require('gulp');
var zip = require('gulp-vinyl-zip').zip;

var config = require('./../config.json');
var packageConfig = require('./../../package.json');

/**
 * @returns {*}
 */
function buildTar() {
    return gulp.src(path.join(config.build.dir, '**/*'))
        .pipe(zip(packageConfig.name + '.zip'))
        .pipe(gulp.dest('./'));
}

exports.buildTar = buildTar;