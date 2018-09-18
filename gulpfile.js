
// Require modules
var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'), // compress images: jpg, png, svg
    newer = require('gulp-newer'), // dont use existing files
    sass = require('gulp-sass'), // lib-sass
    autoprefixer = require('gulp-autoprefixer'), // vwndors prefixes
    cleanCSS = require('gulp-clean-css'), // Minify css
    sourcemaps = require('gulp-sourcemaps'), // source maps for css and js
    concat = require('gulp-concat'), // concatenate files
    uglify = require('gulp-uglify'), // minify javascripts
    del = require('del'); // clean target dir

// Variables
var 
  source = 'source/',
  target = 'public/',
  images = {
    'in': source + 'assets/images/**/*.*',
    'out': target + 'assets/images/'
  },
  styles = {
    'in': source + 'assets/scss/app.scss',
    'out': target + 'assets/css/'
  },
  scripts = {
    'in': source + 'assets/js/**/*.*',
    'out': target + 'assets/js/',
    'filename': 'app.min.js'
  },
  fonts = {
    'in': source + 'assets/fonts/**/*.*',
    'out': target + 'assets/fonts/'
  };

// Tasks
  
// Images
gulp.task('images', function() {
  return gulp.src(images.in)
    .pipe(newer(images.out))
    .pipe(imagemin())
    .pipe(gulp.dest(images.out));
});

// Cleaning destination
gulp.task('clean', function() {
  return del([
    target + '*'
  ]);
});

// Watch tasks
gulp.task('watch', function() {
  gulp.watch(images.in, gulp.series('images'));
  gulp.watch(styles.in, gulp.series('sass'));
  gulp.watch(scripts.in, gulp.series('scripts'));
  gulp.watch(fonts.in, gulp.series('fonts'));
});

// SASS
gulp.task('sass', function() {
  return gulp.src(styles.in)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(styles.out));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src(scripts.in)
    .pipe(sourcemaps.init())
    .pipe(newer(scripts.out))
    .pipe(concat(scripts.filename))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(scripts.out));
});

// Fonts
gulp.task('fonts', function() {
  return gulp.src(fonts.in)
    .pipe(newer(fonts.out))
    .pipe(gulp.dest(fonts.out));
});

gulp.task('build', gulp.series('clean', gulp.parallel('sass', 'scripts', 'images',  'fonts')));

// default Task

// Пустая задача
// gulp.task('default', function(callback) {
//   callback();
// });

// Отслеживание изменений в каталоге с запуском задачи
gulp.task('default', gulp.series('build', 'watch'));
