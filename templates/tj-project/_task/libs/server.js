/**
 * Created by damujiangr on 16/9/18.
 */
var _ = require('lodash');
var browserSync = require('browser-sync').create();
var gutil = require('gulp-util');

//本地模块
var config = require('./../config.json');

/**
 * 启动服务
 * mock对ajax的拦截和browser-sync/socket.io冲突
 * @param options
 */
function startServer(options) {
    options = options || {};

    options = _.extend(config.server, options);

    browserSync.init(options);
}

/**
 * reload
 */
function serverReload() {
    gutil.log('reloaded!');
    browserSync.reload();
}

exports.startServer = startServer;
exports.serverReload = serverReload;