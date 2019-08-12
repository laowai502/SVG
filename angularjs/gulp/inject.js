'use strict';

var path = require('path');
var gulp = require('gulp');
var setting = require('./setting');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function() {
	browserSync.reload();
});

gulp.task('inject', ['scripts', 'styles'], function() {
	
	var injectStyles = gulp.src([
		path.join(setting.paths.tmp, '/serve/app/**/*.css'),
		path.join('!' + setting.paths.tmp, '/serve/app/vendor.css')
	], {
		read: false
	});
	
//	var injectLibsStyles = gulp.src([
//		path.join(setting.paths.src, '/assets/libs/*.css')
//	], {
//		read: false
//	});
//	var injectLibsStylesOptions = {
//		starttag: '<!-- inject:libs.css -->',
//		addRootSlash: false
//	};

//		<!-- build:css(src) styles/libs.css -->
//		<!-- inject:libs.css -->
//		<!-- endinject -->
//		<!-- endbuild -->

	var injectScripts = gulp.src([
			path.join(setting.paths.src, '/app/**/*.module.js'),
			path.join(setting.paths.src, '/app/**/*.js'),
			path.join('!' + setting.paths.src, '/app/**/*.spec.js'),
			path.join('!' + setting.paths.src, '/app/**/*.mock.js')
		])
		.pipe($.angularFilesort()).on('error', setting.errorHandler('AngularFilesort'));

	var injectOptions = {
		ignorePath: [setting.paths.src, path.join(setting.paths.tmp, '/serve')],
		addRootSlash: false
	};
	
	var injectLibsScripts = gulp.src([
		path.join(setting.paths.src, '/assets/libs/*.js')
	]);
	var injectLibsScriptsOptions = {
		starttag: '<!-- inject:libs.js -->',
		ignorePath: [setting.paths.src, path.join(setting.paths.tmp, '/serve')],
		addRootSlash: false
	};

	return gulp.src(path.join(setting.paths.src, '/*.html'))
		.pipe($.inject(injectStyles, injectOptions))
//		.pipe($.inject(injectLibsStyles, injectLibsStylesOptions))
		.pipe($.inject(injectScripts, injectOptions))
		.pipe($.inject(injectLibsScripts, injectLibsScriptsOptions))
		.pipe(wiredep(_.extend({}, setting.wiredep)))
		.pipe(gulp.dest(path.join(setting.paths.tmp, '/serve')));
});