/**
 * Created by damujiangr on 16/9/17.
 */
var path = require('path');
var gulp = require('gulp');
var useref = require('gulp-useref');
var inlinesource = require('gulp-inline-source');
var concat = require('gulp-concat');
var tmpl2js = require('gulp-tmpl2js');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var del = require('del');

//本地模块
var config = require('./../config.json');
/**
 * HTML模板中的引用路径修改
 * TODO 暂时没有CSS引用路径的处理
 */
function compileUseref() {
    return gulp.src(config.src.html, {
            base: config.src.dir
        })
        .pipe(useref({
            noAssets: false
        }))
        .pipe(inlinesource({
            compress: true
        }))
        .pipe(gulp.dest(config.tmp.dir))
        .on('end', function () {
            //将useref打包的JS资源压缩，并转移到构建中间目录中
            gulp.src(['js/**/*.js'], {base: '.'})
                .pipe(uglify({
                    mangle: false
                }))
                .pipe(gulp.dest(config.tmp.dir))
                .on('end', function () {
                    del(['./js']);
                });
        });

}

/**
 * 将模板转为js
 * 使用AMD规范封装
 * @returns {*}
 */
function compileTmpl() {
    return gulp.src(config.src.tmpl)
        .pipe(tmpl2js({
            mode: 'format',
            wrap: 'amd'
        }))
        .pipe(gulp.dest(config.src.tmplDir));
}

/**
 * 压缩HTML
 */
function compressHtml() {
    return gulp.src(path.join(config.tmp.html, '/**/*.html'))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(config.tmp.html));
}

exports.compileUseref = compileUseref;
exports.compileTmpl = compileTmpl;
exports.compressHtml = compressHtml;