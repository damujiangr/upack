/**
 * CSS文件的处理
 * Sass文件的编译、添加浏览器前缀、压缩
 *
 * Created by damujiangr on 16/9/17.
 */
var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('gulp-cssnano');

//本地模块
var config = require('./../config.json');

//TODO postcss的配置
var postcssConfig = [
    autoprefixer({
        remove: false,
        browsers: ['last 5 versions', '>1%']
    })
];

/**
 * 对config.src.sass的文件进行编译
 * @returns {*}
 */
function compileSass() {
    return gulp.src(config.src.sass)
        .pipe(sass()).on('error', sass.logError)
        .pipe(gulp.dest(config.tmp.css));
}

/**
 * 自动添加浏览器前缀，需要配置postcssConfig
 * @return {[type]} [description]
 */
function addCssPrefixer() {
    return gulp.src(path.join(config.tmp.css, '/**/*.css'))
        .pipe(postcss(postcssConfig))
        .pipe(gulp.dest(config.tmp.css));
}

/**
 * 压缩CSS
 * @returns {*}
 */
function compressCss() {
    return gulp.src(path.join(config.tmp.css, '/**/*.css'))
        .pipe(cssnano())
        .pipe(gulp.dest(config.tmp.css));
}

exports.compileSass = compileSass;
exports.addCssPrefixer = addCssPrefixer;
exports.compressCss = compressCss;