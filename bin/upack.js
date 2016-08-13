#!/usr/bin/env node

var Liftoff = require('liftoff');
var cli = require('../lib/cli');

var upack = new Liftoff({
  name: 'upack',
  processTitle: 'upack',
  moduleName: 'upack'
});

upack.launch({}, function (env) {
  cli.start(env);
});
