/**
 * Created by damujiangr on 16/9/17.
 */
var gulp = require('gulp');

//本地模块
var config = require('./../config.json');

/**
 * 复制Mock数据
 * @returns {*}
 */
function copyMock() {
    return gulp.src(config.src.mock)
        .pipe(gulp.dest(config.tmp.mock));
}

exports.copyMock = copyMock;