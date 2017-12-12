var gulp = require('gulp');
var rename = require('gulp-rename');

gulp.task('copy', function() {
  gulp.src('publish/index.html')
    .pipe(gulp.dest(''))
    .pipe(rename('404.html'))
    .pipe(gulp.dest('.'));
});
