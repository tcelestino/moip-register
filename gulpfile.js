'use strict';

var gulp = require('gulp');
var gulpLoad = require('gulp-load-plugins');
var gulpif = require('gulp-if');
var sprite = require('sprity');
var browserSync = require('browser-sync');
var rimraf = require('rimraf');

const SOURCE = {
  scss: 'src/scss/**/*.scss',
  css: 'src/css/*.css',
  js: 'src/js/**/*.js',
  sprites: 'src/images/sprites/*.png',
  images: 'src/images/*.{jpg,png,gif}'
};

let $ = gulpLoad();
let server = browserSync.create();
let config = {
  dev: {
    server: "./src",
    port: 8000
  },
  build: {
    server: './www',
    notify: false,
    port: 8000
  }
};

var clean = function (source, callback) {
  return rimraf(source, callback, { read: false});
};

gulp.task('server:dev', ['sprites', 'css:dev'], function() {
  server.init(config.dev);
  gulp.watch(SOURCE.scss, ['css:dev']);
  gulp.watch(SOURCE.sprites, ['sprites']);
  gulp.watch(SOURCE.js).on('change', server.reload);
  gulp.watch("src/*.html").on('change', server.reload);
});

gulp.task('css:dev', function() {
  return gulp.src(SOURCE.scss)
    .pipe($.sass({
    }).on('error', $.sass.logError))
    .pipe(gulp.dest('src/css'))
    .pipe(server.stream());
});

gulp.task('sprites', function () {
  return sprite.src({
    src: SOURCE.sprites,
    style: './_sprite.scss',
    processor: 'sass',
  })
  .pipe(gulpif('*.png', gulp.dest('./src/images/'), gulp.dest('./src/scss/')))
  .pipe(server.stream());
});

gulp.task('prefixer', function() {
  return gulp.src(SOURCE.css)
    .pipe($.autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
    .pipe(gulp.dest('src/css'));
});

gulp.task('clean:css', (cb) => {
  clean('src/css/', cb);
});

gulp.task('clean:html', (cb) => {
  clean('www/', cb);
});

gulp.task('css', ['prefixer'], function() {
  return gulp.src(SOURCE.scss)
    .pipe($.sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('src/css'));
});

gulp.task('lint', function() {
  return gulp.src(SOURCE.js)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default', { verbose: true }));
});

gulp.task('html', ['css'], function() {
    return gulp.src('src/*.html')
      .pipe($.useref())
      .pipe(gulpif('*.js', $.uglify()))
      .pipe(gulpif('*.css', $.cssmin()))
      .pipe(gulp.dest('www'));
});

gulp.task('images', ['sprites'], function() {
  return gulp.src(SOURCE.images)
    .pipe($.imagemin())
    .pipe(gulp.dest('www/images/'));
});

gulp.task('server:build', ['clean', 'lint', 'images', 'html'], function() {
  server.init(config.build);
});

gulp.task('clean', ['clean:html', 'clean:css']);
gulp.task('default', ['server:dev']);
gulp.task('test', ['lint']);
gulp.task('build', ['server:build']);
