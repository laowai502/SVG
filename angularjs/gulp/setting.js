/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');
var path = require('path');
var minimist = require('minimist');
var fs = require("fs");

var knownOptions = {
    string: 'env'
};
var options = minimist(process.argv.slice(2), knownOptions);

exports.argv = options;

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  zip: '.zip'
};


/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  exclude: [/\/bootstrap\.js$/, /\/bootstrap-sass\/.*\.js/, /\/bootstrap\.css/,/\/font-awesome\.css/],
  directory: 'bower_components'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function (title) {
  'use strict';

  return function (err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
exports.getMinimist = function() {

    var args = minimist(process.argv.slice(2), {
        boolean: ['pro', 'development', 'test', 'uat'],
        string: ['env']
    });

    if(!args.env) {
        if(args.pro === true) {
            args.env = 'pro';
        } else if(args.development === true) {
            args.env = 'development';
        } else if(args.testing === true) {
            args.env = 'test';
        } else if(args.uat === true) {
            args.env = 'uat';
        } else {
            args.env = 'test';
        }
    }

    return args;
}

