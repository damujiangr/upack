'use strict';

var path = require('path');

var fs = require('graceful-fs');
var jsonfile = require('jsonfile');

var upack = require('../upack');

module.exports = function () {
  var componentJson = path.join(upack.root, 'component.json');
  var json = {};

  if (fs.existsSync(componentJson)) {
    json = jsonfile.readFileSync(componentJson);
  }

  return upack.async(json);
};
