'use strict';

var path = require('path');

var _ = require('lodash');
var fs = require('graceful-fs');
var ini = require('ini');
var jsonfile = require('jsonfile');
var Promise = require('bluebird');

var upack = require('./upack');

function getUserHome() {
  return process.env[('win32' === process.platform) ? 'USERPROFILE' : 'HOME'];
}

module.exports = function (semantic) {
  var componentJson = path.join(upack.root, 'component.json');
  var profile = upack.profile;
  var profileFile = path.join(getUserHome(), '.upackrc');
  var linkMap = _.assign({}, profile.link);

  return Promise
    .try(function () {

      if (!semantic) {

        if (!fs.existsSync(componentJson)) {
          throw new Error(upack.i18n('ERROR_NOT_VALID_COMPONENT_DIRECTORY'));
        }

        var json = jsonfile.readFileSync(componentJson);
        var componentName = json.name;
        linkMap[componentName] = upack.root;
        profile.link = linkMap;
        fs.writeFileSync(profileFile, ini.stringify(profile));
        upack.logger.info(upack.i18n('LINK_REGISTERED', componentName.blue, upack.root));
      } else {
        var parsed = upack.parse(semantic);

        if (!linkMap.hasOwnProperty(parsed.name) || !linkMap[parsed.name]) {
          throw new Error(upack.i18n('ERROR_NO_LINK_FOUND', parsed.name));
        }

        var target = linkMap[parsed.name];
        var linkPath = path.join(upack.componentRoot, parsed.name);

        if (!fs.existsSync(target)) {
          throw new Error(upack.i18n('ERROR_LINK_TARGET_NOT_EXIST'));
        }

        if (!fs.existsSync(upack.componentRoot)) {
          fs.mkdirSync(upack.componentRoot);
        }

        if (fs.existsSync(linkPath)) {
          throw new Error(upack.i18n('LINK_PATH_EXISTS'));
        }

        fs.symlinkSync(target, linkPath);
        upack.logger.info(upack.i18n('LINKED_COMPONENT', parsed.name.blue));
      }
    })
    .catch(upack.errorHandler);

};
