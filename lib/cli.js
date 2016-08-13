'use strict';

var _ = require('lodash');
var program = require('commander');
var colors = require('colors');

var upack = require('./upack');
var bootstrap = require('./bootstrap');
var gitlabRepo = require('./remote/gitlab');

var cli = {};

cli.start = function (env) {

  upack.on('ready', function () {
    gitlabRepo.initialize();
    cli.run(env);
  });

  bootstrap(env);

};

cli.name = 'upack';

cli.run = function (env) {
  /**
   * Global command
   */
  program.usage('[options]')
    .description('A magic component management tool');
  /**
   * Initialize component
   */
  program
    .command('init')
    .description(upack.i18n('INITIALIZE_COMPONENT'))
    .option('-A, --all', 'init with all options')
    .option('-S, --skip', 'skip setting and use all default options')
    .action(function () {
      var init = require('./init');
      var args = [].slice.call(arguments);
      var options = args.pop();
      options = _(options).pick(['all', 'skip']).value();
      init(options);
    });
  /**
   * Installing component(s)
   */
  program
    .command('install [component...]')
    .alias('i')
    .description(upack.i18n('INSTALL_COMPONENTS'))
    .option('-R, --resolve', 'resolve version conflict')
    .action(function () {
      var install = require('./install');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var semList = args[0];
      options = _(options).pick(['resolve']).value();
      install(semList, options);
    });
  /**
   * Uninstalling component(s)
   */
  program
    .command('uninstall <component...>')
    .alias('un')
    .description(upack.i18n('UNINSTALL_COMPONENTS'))
    .option('-F, --force', 'force to uninstall component(s)')
    .action(function () {
      var uninstall = require('./uninstall');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var semList = args[0];
      options = _(options).pick(['force']).value();
      uninstall(semList, options);
    });
  /**
   * Listing component versions
   */
  program
    .command('list [component...]')
    .alias('ls')
    .option('-U, --update', 'check available update(s)')
    .description(upack.i18n('LIST_COMPONENT_VERSIONS'))
    .action(function () {
      var list = require('./list');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var semList = args[0];
      options = _(options).pick(['update']).value();
      list(semList, options);
    });
  /**
   * Showing component information
   */
  program
    .command('info <component>')
    .description(upack.i18n('SHOW_COMPONENT_INFORMATION'))
    .action(function () {
      var info = require('./info');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var semantic = args[0];
      options = {};
      info(semantic, options);
    });
  /**
   * Linking component
   */
  program
    .command('link [component]')
    .description(upack.i18n('LINK_COMPONENT'))
    .action(function () {
      var link = require('./link');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var semantic = args[0];
      options = {};
      link(semantic, options);
    });
  /**
   * Searching components
   */
  program
    .command('search <pattern>')
    .alias('s')
    .option('-N, --by-name', 'search components by name')
    .option('-D, --by-description', 'search components by description')
    .option('-O, --by-owner', 'search components by owner')
    .option('-S, --semantic', 'show semantic component name')
    .description(upack.i18n('SEARCH_COMPONENTS'))
    .action(function () {
      var search = require('./search');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var pattern = args[0];
      options = _(options).pick(['byName', 'byDescription', 'byOwner', 'semantic']).value();
      search(pattern, options);
    });
  /**
   * User profile
   */
  program
    .command('profile [query]')
    .alias('p')
    .option('-D, --default', 'configure default settings')
    .description(upack.i18n('MANAGE_USER_PROFILE'))
    .action(function () {
      var profile = require('./profile');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var query = args[0];
      options = _(options).pick(['default']).value();
      profile(query, options);
    });
  /**
   * Print component dependencies tree
   */
  program
    .command('tree [component...]')
    .alias('t')
    .option('-R, --remote', 'print remote dependencies tree')
    .description(upack.i18n('PRINT_COMPONENT_DEPENDENCIES_TREE'))
    .action(function () {
      var profile = require('./tree');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var semList = args[0];
      options = _(options).pick(['remote']).value();
      profile(semList, options);
    });
  /**
   * Versioning component(s)
   */
  program
    .command('version [releaseType]')
    .alias('v')
    .option('-N, --number', 'versioning component with specific number')
    .description(upack.i18n('VERSIONING_COMPONENT'))
    .action(function () {
      var version = require('./version');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var releaseType = args[0];
      options = _(options).pick(['number']).value();
      version(releaseType, options);
    });
  /**
   * Updating component(s)
   */
  program
    .command('update [component...]')
    .alias('u')
    .description(upack.i18n('UPDATE_COMPONENTS'))
    .action(function () {
      var update = require('./update');
      var args = [].slice.call(arguments);
      var options = {};
      var semList = args[0];
      options = {};
      update(semList, options);
    });
  program.parse(process.argv);
  // If no sub-commands and options are passed, output help info
  if (!process.argv.slice(2).length) {
    program.outputHelp(function (txt) {
      var json = require('../package.json');
      upack.logger.info('upack version: ' + json.version.yellow);
      return txt;
    });
  }
};

module.exports = cli;
