/**
 * 相对路径转为绝对路径，并且添加CDN域名
 * Created by damujiangr on 2016/10/15.
 */
'use strict';

var path = require('path');
var url = require('url');

var gulp = require('gulp');
var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');

var config = require('./../config.json');
var projectName = config['deploy']['projectName'] || process.cwd().split(path.sep).pop();
var basePath = config['deploy']['basePath'];

/**
 *
 * @param options
 *  asset 资源的根路径
 *  remotePath 远程部署路径
 *  domain 域名
 */
function transformPath(options) {
    var contents, mainPath, reg, asset, assetAbsolute, domain, remotePath;

    //资源的路径
    asset = options.asset || process.cwd();
    //远程部署路径的相对路径
    remotePath = options.remotePath || '/';
    //域名
    //1. 为String '/'时，所有相对路径妆化为绝对路径
    //2. 值为Object 时，按照文件类型赋值不同的CDN域名
    domain = options.domain || '/';

    assetAbsolute = path.resolve(asset);

    //匹配正则
    reg = new RegExp('["\'\\(]\\s*([\\w\\_\/\\.\\-]*\\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|js|css))[^\\)"\']*\\s*[\\)"\']', 'gim');

    return through.obj(function (file, enc, callback) {
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', gutil.log('Streams are not supported!'));
            return callback();
        }

        mainPath = path.dirname(file.path);

        contents = file.contents.toString().replace(reg, function (content, filePath) {
            var relative;

            if (/^\//.test(filePath)) {
                relative = filePath.replace(/^\//, '');
            } else {
                if (mainPath.indexOf(assetAbsolute) !== -1) {
                    relative = path.relative(asset, path.resolve(asset, mainPath, filePath));
                }
            }
            return relative ? (function () {
                var prefix = '';
                //根据文件后缀划分资源类型
                var ext = path.extname(relative);
                if (domain == '/') {
                    prefix = domain;
                } else if (_.indexOf(['.js'], ext) > -1) {
                    prefix = domain['js'] || '/';
                } else if (_.indexOf(['.css'], ext) > -1) {
                    prefix = domain['css'] || '/';
                } else if (_.indexOf(['.jpg', '.jpeg', '.png', '.gif'], ext) > -1) {
                    prefix = domain['img'] || '/';
                } else if (_.indexOf(['.eot', '.svg', '.ttf', '.woff'], ext) > -1) {
                    prefix = domain['font'] || '/';
                }
                return content.replace(filePath, url.resolve(prefix, path.join(remotePath, relative)));
            })() : content;
        });

        file.contents = new Buffer(contents);

        this.push(file);
        return callback();
    });
}

/**
 * 路径转化
 * @returns {*}
 */
function absoluteAndDomain() {
    var remotePath = path.join(basePath, projectName);

    var sourceCss = path.join(config.tmp.dir, '/**/*.css');
    var sourceHtml = path.join(config.tmp.dir, '/**/*.html');

    return gulp.src([sourceHtml, sourceCss], {base: config.tmp.dir})
        .pipe(transformPath({
            asset: config.tmp.dir,
            remotePath: remotePath,
            domain: {
                'js': '//j1.58cdn.com.cn/',
                'css': '//c.58cdn.com.cn/',
                'img': '//img.58cdn.com.cn/',
                'font': '//img.58cdn.com.cn/webfonts/'
            }
        }))
        .pipe(gulp.dest(config.tmp.dir));
}

exports.absoluteAndDomain = absoluteAndDomain;