/**
 * Created by damujiangr on 16/9/17.
 */

//本地模块
var config = require('./config.json');

require('./build-' + config.mode);