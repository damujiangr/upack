'use strict';

var _ = require('lodash');
var treeify = require('treeify');
var Spinner = require('cli-spinner').Spinner;

var upack = require('./upack');
var Component = require('./component/Component');
var Tree = require('./component/Tree');
var getInstalled = require('./component/getInstalled');

module.exports = function (semList, options) {
  var promise;
  var children = [], parsedList, rootComponent;
  var spinner;

  if (options.remote) {

    if (!semList.length) {
      throw new Error('No component was specified!');
    }

    spinner = new Spinner(upack.i18n('ANALYZING_DEPENDENCIES'));
    spinner.setSpinnerString('|/-\\');
    spinner.start();

    parsedList = semList.map(function (semantic) {
      return upack.parse(semantic);
    });

    children = parsedList.map(function (parsed) {
      return {
        props: parsed
      };
    });

    rootComponent = new Component(null, 'root', {
      children: children
    });

    promise = rootComponent.getRemoteDependenciesTree();
  } else {
    promise = getInstalled()
      .then(function (installed) {

        if (semList.length > 0) {
          parsedList = semList.map(function (semantic) {
            return upack.parse(semantic);
          });

          installed = installed.filter(function (component) {
            return ~_.findIndex(parsedList, {
              name: component.name,
              owner: component.owner
            });
          });

          children = installed.map(function (component) {
            return {
              props: {
                name: component.name,
                owner: component.owner,
                version: component.version,
                installed: true,
                specified: true
              }
            };
          });

          rootComponent = new Component(null, 'root', {
            children: children
          });

        } else {
          rootComponent = new Component(null, 'root');
        }

        return rootComponent.getLocalDependenciesTree();
      });
  }

  return promise
    .then(function (filledTree) {
      var treeModel = new Tree(filledTree);
      var treeMap = treeify.asTree(treeModel.transform());

      if (spinner) {
        spinner.stop(true);
      }

      upack.logger.info(upack.i18n('DEPENDENCIES_TREE') + '\n' + treeMap);
      // upack.logger.info(upack.i18n('FINISH_ANALYZING_DEPENDENCIES'));
      return treeModel;
    })
    .catch(function (err) {

      if (spinner) {
        spinner.stop(true);
      }

      upack.errorHandler(err);
      return {};
    });

};
