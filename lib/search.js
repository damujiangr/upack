'use strict';

var Spinner = require('cli-spinner').Spinner;

var upack = require('./upack');
var gitlabRepo = require('./remote/gitlab');

module.exports = function (pattern, options) {

  var spinner = new Spinner(upack.i18n('SEARCHING_COMPONENTS'));
  spinner.setSpinnerString('|/-\\');
  spinner.start();

  return gitlabRepo.searchComponents(pattern, options)
    .then(function (results) {
      var lines = results.map(function (result) {
        return (options.semantic ? upack.stringify(result) : result.name) + ': ' + result.description;
      }).join('\n');

      if (!lines) {
        lines = upack.i18n('NO_MATCHED_RESULTS');
      }

      spinner.stop(true);
      upack.logger.info(upack.i18n('SEARCH_RESULTS', lines));
    })
    .catch(function (err) {
      spinner.stop(true);
      upack.errorHandler(err);
      return {};
    });

};
