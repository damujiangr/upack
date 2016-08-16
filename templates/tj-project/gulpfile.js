var gulp = require('gulp');
var hub = require('gulp-hub');

/**
 * 构建的配置文件
 */
var config = {
    "mode": "m" //项目的模式<m>|<pc>
};

/**
 * use the external task
 */
hub(['task/build-' + config.mode + '-*.js']);
