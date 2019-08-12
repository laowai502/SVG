'use strict';

var path = require('path');
var gulp = require('gulp');
var setting = require('./setting');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('scripts-reload', function() {
	return buildScripts()
		.pipe(browserSync.stream());
});

gulp.task('scripts', function() {
	return buildScripts();
});

function buildScripts() {
	return gulp.src(path.join(setting.paths.src, '/app/**/*.js'))
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.size())
};