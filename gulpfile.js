var
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript'),
    prettify = require('gulp-prettify')
;

gulp.task('typescript', function() {
    return gulp.src('typescript/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts({declarationFiles:false})).js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'))
    ;
});

gulp.task('sass', function () {
	return gulp.src('./sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist'))
        .pipe(livereload());
});

gulp.task('default', function () {
    gulp.start('sass', 'typescript', 'watch');
});


gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('typescript/**/*.ts', ['typescript']);

    gulp.watch('**/*.html', function(file) {
        livereload.changed(file.path);
    });
});