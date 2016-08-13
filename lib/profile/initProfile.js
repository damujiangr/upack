'use strict';

var path = require('path');
var fs = require('graceful-fs');
var inquirer = require('inquirer');
var ini = require('ini');

var upack = require('../upack');
var questions = require('./questions');

function getUserHome() {
  return process.env[('win32' === process.platform) ? 'USERPROFILE' : 'HOME'];
}

module.exports = function () {
  var profileFile = path.join(getUserHome(), '.upackrc');
  upack.logger.info(upack.i18n('USER_PROFILE_NOT_FOUND'));
  return inquirer.prompt(questions)
    .then(function (answers) {
      fs.writeFileSync(profileFile, ini.stringify(answers));
      upack.logger.info(upack.i18n('FINISH_INITIALIZE_USER_PROFILE'));
      return answers;
    });
};
