/**
 * 所有暴露给cli的任务的描述
 * Created by ramboyan on 16/10/28 下午1:03.
 */
var gulp = require('gulp');

var delAll = gulp.task('delAll');
delAll.description = '清除所有构建产生的目录和文件';

var buildCommon = gulp.task('buildCommon');
buildCommon.description = '通用任务，包含主要的构建任务';

var monitorAndServer = gulp.task('monitorAndServer');
monitorAndServer.description = '文件变动监听和静态服务器';

var dev = gulp.task('dev');
dev.description = '开启本地开发模式';

var devAbsolute = gulp.task('dev-abs');
devAbsolute.description = '构建产生用于部署测试环境的文件，引用路径均被修改成绝对路径';

var devDeploy = gulp.task('dev-ftp');
devDeploy.description = '首先执行 dev-abs 任务，然后将构建产生的文件上传到测试机';

var distAbsolute = gulp.task('dist');
distAbsolute.description = '构建产生用于部署生产环境的文件，引用路径均被修改成绝对路径';

var distDeploy = gulp.task('dist-ftp');
distDeploy.description = '首先执行 dist 任务，然后将构建产生的文件上传到测试机';


var dist2svn = gulp.task('dist-svn');
dist2svn.description = '首先执行 dist 任务，然后将构建产生的文件复制到本地SVN目录中';