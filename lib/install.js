'use strict';

var path = require('path');

var _ = require('lodash');
var fs = require('graceful-fs');
var jsonfile = require('jsonfile');
var Promise = require('bluebird');
var treeify = require('treeify');
var inquirer = require('inquirer');

var upack = require('./upack');
var Component = require('./component/Component');
var getInstalled = require('./component/getInstalled');
var getToInstall = require('./component/getToInstall');
var analyze = require('./component/analyze');
var updateComponentJson = require('./component/updateComponentJson');

module.exports = function (semList, options) {
  var parsedList = semList.map(function (str) {
    return upack.parse(str);
  });

  if (!parsedList.length) {
    upack.logger.info(upack.i18n('INSTALL_COMPONENT_JSON_DEPENDENCIES'));
  }

  return Promise
    .props({
      installed: getInstalled(),
      toInstall: getToInstall(parsedList)
    })
    .then(function (results) {
      return analyze(results.toInstall, results.installed, options.resolve ? 'latest' : 'ask');
    })
    .then(function (treeModel) {
      var toInstallAll = treeModel.getAllNodes('DFS').slice(1).filter(function (parsed) {
        return !parsed.installed && !parsed.merged;
      }).map(function (parsed) {
        return new Component(parsed, 'remote');
      });

      if (toInstallAll.length) {
        upack.logger.info(upack.i18n('BEGIN_TO_DOWNLOAD_COMPONENTS'));
      }

      return Promise.reduce(toInstallAll, function (newInstalledList, component) {
        return component.install()
          .then(function (newInstalled) {
            newInstalledList.push(newInstalled);
            return newInstalledList;
          })
          .catch(function (err) {
            // var _err = new Error(upack.i18n('FAIL_TO_INSTALL_COMPONENTS', component.stringify()));
            upack.errorHandler(err);
            return newInstalledList;
          });
      }, []);

    })
    .then(function (newInstalledList) {
      var map = {};
      var rootName = upack.config.name;
      var rootVersion = upack.config.version;
      var tree, str;

      // upack.logger.info(upack.i18n('FINISH_INSTALLING_COMPONENT'));

      if (!newInstalledList.length) {
        upack.logger.info(upack.i18n('NO_COMPONENT_TO_INSTALL'));
        return newInstalledList;
      }

      map = _.zipObject(newInstalledList.map(function (component) {
        return component.stringify();
      }));

      tree = treeify.asTree(map);
      str = rootName ? (rootName + (rootVersion ? '@' + rootVersion : '') + '\n') : '';

      upack.logger.info(upack.i18n('INSTALLED_COMPONENTS', str + tree));

      return newInstalledList;
    })
    .then(function (newInstalledList) {

      if (fs.existsSync(path.join(upack.root, 'component.json'))) {
        return updateComponentJson(newInstalledList);
      }

    })
    .catch(upack.errorHandler);

};
