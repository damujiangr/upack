/**
 * Created by damujiangr on 16/9/17.
 */

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var _ = require('lodash');
var merge = require('merge-stream');
var amdOpt = require('amd-optimize');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');

//本地模块
var config = require('./../config.json');

/**
 * 对config.src.jsPkgDir 目录下的文件进行打包
 * 目录下的文件名即打包后的文件名
 */
function compileScript() {
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

function compressScript() {
    return gulp.src(path.join(config.tmp.js, '/**/*.js'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest(config.tmp.js));
}

exports.compileScript = compileScript;
exports.compressScript = compressScript;