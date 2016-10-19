/**
 * Created by damujiangr on 16/9/18.
 */
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');

//本地模块
var config = require('./../config.json');

/**
 * 监听变化，必须添加cb
 * @param rebuild
 * @param callback cb可以不传值, 但是必须在此有定义
 */
function startMonitor(rebuild, callback) {
    gutil.log(rebuild);
    gutil.log(callback);

    //设定监听的文件
    var watcher = gulp.watch([
        config.src.html,
        config.src.tmpl,
        path.join(config.src.jsDir, '/**/*.js'),
        path.join(config.src.sassDir, '/**/*.scss'),
        config.src.mock,
        config.src.webfonts,
        config.src.img,
        config.src.slice
    ], {
        ignored: /[\/\\]\./
    });

    //TODO 事件列表
    watcher.on('change', function (file) {
            gutil.log(file + ' has been changed');
            rebuild();
        })
        .on('add', function (file) {
            gutil.log(file + ' has been added');
            rebuild();
        })
        .on('unlink', function (file) {
            gutil.log(file + ' is deleted');
            rebuild();
        });

    callback();
}

exports.startMonitor = startMonitor;