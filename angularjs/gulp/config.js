var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var setting = require('./setting');
var rename = require("gulp-rename");

/*
 根据命令行的参数（开发/生产/测试环境）生成最终 config.js
*/
gulp.task('config', function () {
    var args = setting.getMinimist();
    var env = args.env.toLowerCase();
    if(setting.argv.env){
        return gulp.src(path.join(setting.paths.src+ '/assets/config/' + env + '/config.js'))
            .pipe(rename('config.js'))
            .pipe(gulp.dest(path.join(setting.paths.src + '/assets/config')))
    }else{
        return false
    }
});
gulp.task('config-build', function (event) {
    var args = setting.getMinimist(),
        env = args.env.toLowerCase();

    // 载入配置文件
    var uri = path.resolve(setting.paths.src + '/assets/config/' + env + '/config.js');
    gutil.log('use config file named  ' + uri);

    return gulp
        .src(uri)
        .pipe(gulp.dest(path.resolve(setting.paths.dist + '/assets/config')));
});
