const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

const paths = {
  src: {
    js: 'src/js/**/*.js',
    sass: 'src/sass/**/*.*',
    img: 'src/img/**/*.*',
  },
  out: {
    css: 'public/css',
    js: 'public/js',
    img: 'public/img',
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

gulp.task('img', function() {
  return gulp.src(paths.src.img).
      pipe(gulp.dest(paths.out.img));
});

gulp.task('build', gulp.series(['sass', 'js', 'img']));

gulp.task('watch', function() {
  gulp.watch([paths.src.sass, paths.src.js, paths.src.img], gulp.series('build'));
});
