'use strict';

var path = require('path');
var gulp = require('gulp');
var setting = require('./setting');
var zip = require('gulp-zip');
var rename = require("gulp-rename");

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    path.join(setting.paths.src, '/app/**/*.html'),
    path.join(setting.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'CommericalConcreteWeb',
      root: 'app'
    }))
    .pipe(gulp.dest(setting.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(setting.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(setting.paths.tmp, '/partials'),
    addRootSlash: false
  };
  var htmlFilter = $.filter('*.html', { restore: true });
  var jsFilter = $.filter(['**/*.js'], { restore: true });
  var cssFilter = $.filter('**/*.css', { restore: true });
  var assets;

  return gulp.src(path.join(setting.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
      .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', setting.errorHandler('Uglify'))
      .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.replace('../../bower_components/bootstrap-sass/assets/fonts/bootstrap/', '../fonts/'))
    .pipe($.replace('../../bower_components/font-awesome/fonts/', '../fonts/'))
    .pipe($.replace('./img/', '../assets/images/'))
    .pipe($.minifyCss({ processImport: false }))
    .pipe(cssFilter.restore)
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(setting.paths.dist, '/')))
    .pipe($.size({ title: path.join(setting.paths.dist, '/'), showFiles: true }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('test', function () {

  gulp.src('./')
    .pipe($.filter(['**/*.js']))
    .pipe(gulp.dest('./dist-test'));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(setting.paths.dist, '/fonts/')));
});

gulp.task('fontawesome', function () {
   return gulp.src('bower_components/font-awesome/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(setting.paths.dist, '/fonts/')));
});
gulp.task('other', function () {
  return gulp.src('bower_components/angular-ui-grid/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(setting.paths.dist, '/fonts/')));
});

gulp.task('src', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(setting.paths.src, '/**/*'),
    path.join('!' + setting.paths.src, '/**/*.{html,css,js,scss}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(setting.paths.dist, '/')));
});

gulp.task('overload', function () {
  return gulp.src(path.join(setting.paths.src, 'assets/overload/**/*'))
    .pipe(gulp.dest(path.join(setting.paths.dist, 'assets/overload/')));
});

gulp.task('images', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join('bower_components/ztree/css/zTreeStyle/img/*')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(setting.paths.dist, '/assets/images')));
});

gulp.task('clean', function () {
    return $.del([path.join(setting.paths.dist, '/'), path.join(setting.paths.tmp, '/'), path.join(setting.paths.zip, '/')]);
});

if(!setting.argv._[0]&&setting.argv.env){
    if("'development','test','uat','pro'".indexOf(setting.argv.env)==-1){
        console.dir("ERROR:The command of env is error ! ");
        return false;
    }
}
if(!setting.argv._[0]&&setting.argv.env==''){//只输入gulp --env时报错
    console.log("ERROR:The command of env is null ! ");
    return false;
}

gulp.task('urls', ['html','fontawesome','fonts', 'images', 'other', 'src',  'overload', 'config-build']);

gulp.task('zip', ['urls'], function (){
    var file=['dist/*',path.join(setting.paths.dist, '/**/*'),path.join(setting.paths.dist, '/**/**/*')];
    var name=setting.argv.env?setting.argv.env:'dist';
    return gulp.src(file)
        .pipe(zip(name+'.zip'))
        .pipe(gulp.dest(path.join(setting.paths.zip,'/')));
});

gulp.task('builds',['zip']);