'use strict';

var path = require('path');

var upack = require('../upack');

module.exports = function (options) {
  var defaults = {};

  defaults.name = path.basename(upack.root);
  defaults.version = '1.0.0';
  defaults.username = upack.profile.username;
  defaults.email = upack.profile.email;
  defaults.token = upack.profile.token;

  return upack.async(defaults);
};
