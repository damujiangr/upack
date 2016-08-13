'use strict';

var path = require('path');
var http = require('http');
var https = require('https');
var url = require('url');

var _ = require('lodash');
var fs = require('graceful-fs');
var gitlab = require('gitlab');
var Promise = require('bluebird');
var semver = require('semver');
var ProgressBar = require('progress');

var upack = require('../upack');

var GitlabRepo = function () {
  this.gitlab = {};
  this.repo = null;
};

GitlabRepo.prototype = {
  constructor: GitlabRepo,
  initialize: function () {
    var self = this;
    self.gitlab.token = upack.profile.token;
    self.gitlab = gitlab({
      token: upack.profile.token,
      url: upack.config.domain + '/api/v3'
    });
    self.repo = self.gitlab.projects.repository;
  },
  getArchive: function (namespace, projectName, tagName) {
    var archiveUrl = upack.config.domain + '/' + namespace + '/' + projectName + '/repository/archive.zip?ref=' + tagName + '&private_token=' + upack.profile.token;
    var prefix = namespace + '/' + projectName + '-' + tagName;
    var archivePath = path.join(upack.tmpDir, prefix + '-archive.zip');
    archiveUrl = url.parse(archiveUrl);
    var client = ('http:' === archiveUrl.protocol ? http : https);
    var semantic = upack.stringify({
      name: projectName,
      owner: namespace,
      version: tagName
    });

    return new Promise(function (resolve) {
      // upack.logger.info('Begin to download ' + specified);
      // upack.logger.info(archiveUrl.href);
      var req = client.request(archiveUrl);
      req.end();
      req.on('response', function (res) {
        var dirname = path.join(upack.tmpDir, namespace);
        var contentLength = res.headers['content-length'] >> 0;
        var bar = new ProgressBar(upack.i18n('DOWNLOADING_COMPONENT', semantic), {
          complete: '=',
          incomplete: ' ',
          width: 20,
          total: contentLength
        });

        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname);
        }

        var stream = fs.createWriteStream(archivePath);
        res.on('data', function (chunk) {
          bar.tick(chunk.length);
          stream.write(chunk);
        });
        res.on('end', function () {
          stream.on('finish', function () {
            // upack.logger.info('Finish downloading ' + prefix);
            resolve(archivePath);
          });
          stream.end();
        });
      });
    });

  },
  validate: function (namespace, projectName, version) {
    var self = this;
    var latestTag = '';
    var promise = version ? upack.async(version) : self.getLatestTag(namespace, projectName).then(function (tag) { return tag.name; });

    return promise
      .then(function (tagName) {
        latestTag = tagName;
        return self.getComponentJson(namespace, projectName, tagName);
      })
      .then(function (json) {

        if (json.version !== latestTag) {
          throw new Error(upack.i18n('ERROR_INVALID_COMPONENT', projectName));
        }

        return json;
      });
  },
  getDependencies: function (namespace, projectName, version) {
    // Get dependencies
    var self = this;
    var node = {};

    return self.validate(namespace, projectName, version)
      .then(function (json) {
        json.dependencies = json.dependencies || [];
        version = version || json.version;
        node.name = upack.stringify({
          name: projectName,
          owner: namespace,
          version: version
        });
        node.dependencies = json.dependencies.map(function (specified) {
          return upack.stringify(upack.parse(specified));
        });

        return node;
      });
  },
  getAllTags: function (namespace, projectName) {
    var self = this;
    var projectId = namespace + '/' + projectName;
    return new Promise(function (resolve, reject) {
      self.repo.listTags(projectId, function (tags) {

        if (!tags) {
          reject(new Error('Repository not found'));
          return false;
        }

        if (tags && !tags.length) {
          reject(new Error('Component tags not found in ' + projectId));
          return false;
        }

        resolve(tags);
      });
    });
  },
  getLatestTag: function (namespace, projectName) {
    var self = this;
    return self.getAllTags(namespace, projectName)
      .then(function (tags) {
        var latest = {};
        latest = _(tags).sortBy('commit.committed_date').last();
        return latest;
      });
  },
  getComponentJson: function (namespace, projectName, tagName) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var projectId = namespace + '/' + projectName;
      self.repo.showFile({
        projectId: projectId,
        ref: 'tags/' + tagName,
        file_path: 'component.json'
      }, function (file) {
        var content, json;

        if (!file) {
          reject(new Error('"component.json" not found in ' + projectId));
          return false;
        }

        content = (new Buffer(file.content, 'base64')).toString();

        try {
          json = JSON.parse(content);
        } catch (err) {
          reject(err);
          return false;
        }

        resolve(json);
      });
    });
  },
  searchComponents: function (pattern, options) {
    var self = this;
    options = options || {};

    return new Promise(function (resolve) {
      self.gitlab.projects.all(function (projects) {
        var results = [];

        results = projects
          .filter(function (project) {

            if (options.byOwner || options.byName || options.byDescription) {
              var ownerMatch = options.byOwner && project.namespace.name.match(pattern);
              var nameMatch = options.byName && project.name.match(pattern);
              var descriptionMatch = options.byDescription && project.description.match(pattern);
              return ownerMatch || nameMatch || descriptionMatch;
            }

            return project.name.match(pattern);
          })
          .map(function (project) {
            return {
              name: project.name,
              owner: project.namespace.name,
              description: project.description
            };
          });

        resolve(results);

      });
    })
      .then(function (results) {
        return Promise.all(results.map(function (result) {
          return self.validate(result.owner, result.name)
            .then(function (json) {
              json.owner = result.owner;
              json.name = result.name;
              return _.pick(json, ['owner', 'name', 'version', 'description']);
            })
            .catch(function () {
              return null;
            });
        }));
      })
      .then(function (results) {
        var filteredResults = _.reject(results, _.isNull);
        return _.sortBy(filteredResults, ['owner', 'name']);
      });
  }
};

module.exports = new GitlabRepo();
