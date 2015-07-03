var
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename")
;

gulp.task('typescript', function() {
    gulp.src('typescript/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts({declarationFiles:false})).js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'))
    ;

    gulp.start('uglify');
});

gulp.task('uglify', function() {
    return gulp.src('dist/neat-tooltip.js')
        .pipe(uglify())
        .pipe(rename('neat-tooltip.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
	return gulp.src('./sass/**/*.scss')
        //.pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}))
        //.pipe(sourcemaps.write())
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