'use strict';
var exec = require('child_process').exec;
var path = require('path');
var gulp = require('gulp');
var setting = require('./setting');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if (baseDir === setting.paths.src || (util.isArray(baseDir) && baseDir.indexOf(setting.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  /*
   * You can add a proxy to your backend by uncommenting the line below.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
   */
  // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', changeOrigin: true});

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['config', 'watch','fontawesome'], function (cb) { 
  browserSyncInit([path.join(setting.paths.tmp, '/serve'), setting.paths.src]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(setting.paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([setting.paths.tmp + '/serve', setting.paths.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(setting.paths.dist, []);
});

