'use strict';

var _ = require('lodash');
var treeify = require('treeify');

var upack = require('./upack');
var getInstalled = require('./component/getInstalled');
var Spinner = require('cli-spinner').Spinner;

var spinner = new Spinner(upack.i18n('CHECKING_UPDATE'));

module.exports = function (semList, options) {

  return getInstalled()
    .then(function (installed) {
      var parsedList = semList.map(function (semantic) {
        return upack.parse(semantic);
      });

      if (parsedList.length) {
        installed = installed.filter(function (component) {
          return ~_(parsedList).findIndex({ name: component.name });
        });
      }

      return installed;
    })
    .then(function (installed) {

      if (options.update) {
        spinner.setSpinnerString('|/-\\');
        spinner.start();
        return Promise.all(installed.map(function (component) {
          return component.checkUpdate();
        }));
      }

      return installed;
    })
    .then(function (installed) {
      var map = {};
      var rootName = upack.config.name;
      var rootVersion = upack.config.version;
      var tree, str;

      if (options.update) {
        spinner.stop(true);
      }

      map = _.zipObject(installed.map(function (component) {
        return component.stringify();
      }));

      tree = treeify.asTree(map);

      str = rootName ? (rootName + (rootVersion ? '@' + rootVersion : '') + '\n') : '';

      upack.logger.info(upack.i18n('COMPONENT_VERSIONS', str + tree));
      return installed.map(function (component) {
        return _(component).pick(['name', 'owner', 'version', 'hasUpdate', 'latest']).value();
      });
    })
    .catch(upack.errorHandler);

};
