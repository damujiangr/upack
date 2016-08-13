'use strict';

var path = require('path');

var _ = require('lodash');
var Promise = require('bluebird');

var upack = require('./upack');
var getProfile = require('./profile/getProfile');
var getConfig = require('./component/getConfig');
var Upack = upack.constructor;

module.exports = function (env, userProfile, userConfig) {
  var profilePromise = (userProfile ? upack.async(userProfile) : getProfile());
  Upack.defaults.config = _.assign({}, Upack.defaults.config, userConfig);

  upack.root = env.cwd;

  Promise
    .try(function () {
      return Promise
        .props({
          userProfile: profilePromise,
          userConfig: getConfig()
        });
    })
    .then(function (results) {
      var profile = results.userProfile;
      var config = results.userConfig;
      upack.initialize({
        cwd: env.cwd
      }, config, profile);
    })
    .catch(upack.errorHandler);

};
