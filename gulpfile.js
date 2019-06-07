const gulp     = require('gulp'),
      sass     = require('gulp-sass'),
      concat   = require('gulp-concat');

const paths = {
    src   : {
        js      : 'src/js/**/*.js',
        sass    : 'src/sass/**/*.sass',
    }, 
    out: {
        css: 'public/css', 
        js: 'public/js',
    },
};

gulp.task('sass', function() {
    return gulp.src(paths.src.sass).
                pipe(sass().on('error', sass.logError)).
                pipe(gulp.dest(paths.out.css));
});

gulp.task('js', function() {
    return gulp.src(paths.src.js).
                pipe(concat('main.js')).
                pipe(gulp.dest(paths.out.js));
});

gulp.task('build', gulp.series(['mainSass', 'js']));

gulp.task('watch', function() {
    gulp.watch([paths.src.sass, paths.src.js], gulp.series('build'));
});