'use strict';

var path = require('path');
var gulp = require('gulp');
var setting = require('./setting');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('styles-reload', ['styles'], function() {
  return buildStyles()
    .pipe(browserSync.stream());
});

gulp.task('styles', function() {
  return buildStyles();
});

var buildStyles = function() {
  var sassOptions = {
    style: 'expanded'
  };

  var injectFiles = gulp.src([
    path.join(setting.paths.src, '/app/**/*.scss'),
    path.join('!' + setting.paths.src, '/app/index.scss')
  ], { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(setting.paths.src + '/app/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };


  return gulp.src([
    path.join(setting.paths.src, '/app/index.scss')
  ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(wiredep(_.extend({}, setting.wiredep)))
    .pipe($.sass(sassOptions)).on('error', setting.errorHandler('Sass'))
    .pipe($.autoprefixer()).on('error', setting.errorHandler('Autoprefixer'))
    .pipe(gulp.dest(path.join(setting.paths.tmp, '/serve/app/')));
};
