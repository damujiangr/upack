'use strict';

var path = require('path');
var url = require('url');

var _ = require('lodash');
var fs = require('graceful-fs');
var treeify = require('treeify');
var ini = require('ini');
var Promise = require('bluebird');

var upack = require('./upack');

function getUserHome() {
  return process.env[('win32' === process.platform) ? 'USERPROFILE' : 'HOME'];
}

module.exports = function (query, options) {
  var profile = upack.profile;

  return Promise
    .try(function () {

      if (query) {
        // Print user profile
        var obj = url.parse('?' + query, true);
        var profileFile = path.join(getUserHome(), '.upackrc');
        var queryObj;

        if (options.default) {
          queryObj = _.pick(obj.query, ['dir', 'protocol', 'domain', 'owner']);
          profile.defaults = _.assign({}, profile.defaults, queryObj);
        } else {
          queryObj = _.pick(obj.query, ['username', 'email', 'token']);
          profile = _.assign({}, profile, queryObj);
        }

        fs.writeFileSync(profileFile, ini.stringify(profile));
      }

      return profile;
    })
    .then(function (profile) {
      var profileList = treeify.asTree(profile, true);
      upack.logger.info(upack.i18n('USER_PROFILE', profileList));
    })
    .catch(upack.errorHandler);

};
