var gulp = require('gulp');
var hub = require('gulp-hub');

/**
 * use the external task - m
 * 同时只能引入一种类型的构建脚本，否则会引起任务冲突
 */
hub(['task/build-m-*.js']);

/**
 * use the external task - pc
 * 同时只能引入一种类型的构建脚本，否则会引起任务冲突
 */
// hub(['task/build-pc-*.js']);
