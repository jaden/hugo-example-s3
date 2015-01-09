var gulp = require('gulp');
var run = require('gulp-run');
var fs = require('fs');
var parallelize = require("concurrent-transform");
var awspublish = require('gulp-awspublish');
  
gulp.task('build', function(cb) {
  run('hugo').exec(cb);
});

gulp.task('publish', ['build'], function() {

  var publisher = awspublish.create(JSON.parse(fs.readFileSync('aws.json')));

  var headers = {
     'Cache-Control': 'max-age=315360000, no-transform, public'
   };

  return gulp.src('./public/**')
    .pipe(parallelize(publisher.publish(headers)), 10)
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('default', ['build', 'publish']);