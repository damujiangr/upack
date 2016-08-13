'use strict';

var path = require('path');

var fs = require('graceful-fs');

var upack = require('../upack');
var Component = require('./Component');

module.exports = function (parsedList) {

  if (!parsedList.length) {
    parsedList = upack.config.dependencies || [];
    parsedList = parsedList.map(function (str) {
      return upack.parse(str);
    });
  }

  if (!parsedList.length) {
    throw new Error(upack.i18n('NO_COMPONENT_TO_INSTALL'));
  }

  parsedList = parsedList.map(function (parsed) {
    parsed.specified = true;
    return parsed;
  });

  return Promise.all(parsedList.map(function (parsed) {
    return upack.async(new Component(parsed, 'remote'));
  }));
};
