/**
 * Created by damujiangr on 16/9/17.
 */
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');

//本地模块
var config = require('./../config.json');

/**
 * 复制图片
 * @returns {*}
 */
function copyImg() {
    return gulp.src(config.src.img)
        .pipe(gulp.dest(config.tmp.img));
}

/**
 * 复制Slice
 * @returns {*}
 */
function copySlice() {
    return gulp.src(config.src.slice)
        .pipe(gulp.dest(config.tmp.slice));
}

/**
 * 压缩图片
 * @returns {*}
 */
function compressImg() {
    return gulp.src(config.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(config.tmp.img));
}

/**
 * 字体
 * @returns {*}
 */
function copyFonts(){
    return gulp.src(config.src.webfonts)
        .pipe(gulp.dest(config.tmp.webfonts));
}

exports.copyImg = copyImg;
exports.copySlice = copySlice;
exports.compressImg = compressImg;
exports.copyFonts = copyFonts;