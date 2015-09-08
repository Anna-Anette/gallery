var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
function swallowError(error) {
    console.log(error.toString());
    this.emit('end');
}
gulp.task('sass', function () {
    return sass('scss/', {
        style: 'compact',
        unixNewlines: true
    })
        .on('error', swallowError)
        .pipe(gulp.dest('css/'));
});
/**
 * Watch tasks
 */
gulp.task('watch', function() {
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('scss/core/*.scss', ['sass']);
});

/**
 * Invoke default tasks
 */
gulp.task('default', ['sass', 'watch']);

