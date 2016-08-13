'use strict';

var path = require('path');

var _ = require('lodash');
var fs = require('graceful-fs');
var jsonfile = require('jsonfile');

var upack = require('../upack');
var Component = require('./Component');
var Tree = require('./Tree');

module.exports = function () {
  var componentDir = upack.componentRoot;
  var rootComponentJson = path.join(upack.root, 'component.json');
  var files = [];
  var dependencies = upack.config.dependencies || [];
  var children;
  dependencies = dependencies.map(function (semantic) {
    var parsed = upack.parse(semantic);

    if (!(parsed.hasOwnProperty('resolved') && parsed.resolved)) {
      parsed.specified = true;
    }

    return parsed;
  });

  children = dependencies.map(function (parsed) {
    return {
      props: parsed
    };
  });

  var rootComponent = new Component(null, 'root', {
    children: children
  });

  if (fs.existsSync(componentDir)) {
    files = fs.readdirSync(componentDir);
  }

  files = files.filter(function (file) {
    return !_.startsWith(file, '.');
  });

  return rootComponent.getLocalDependenciesTree()
    .then(function (filledTree) {
      var treeModel = new Tree(filledTree);
      var installed = treeModel.getAllNodes('DFS').slice(1);
      return Promise.all(files.map(function (file) {
        var matchedSpecified = _.find(dependencies, { name: file }) || {};
        var matchedInstalled = _.find(installed, { name: file}) || {};

        if (!fs.existsSync(rootComponentJson)) {
          var json = jsonfile.readFileSync(path.join(componentDir, file, 'component.json'));
          matchedInstalled.owner = json.owner;
          matchedInstalled.version = json.version;
        }

        var schema = {
          name: file,
          owner: matchedSpecified.owner || matchedInstalled.owner || upack.config.owner,
          specified: Boolean(matchedSpecified.specified),
          resolved: Boolean(matchedSpecified.resolved)
        };

        return upack.async(new Component(schema, 'local'));
      }));
    });

};
