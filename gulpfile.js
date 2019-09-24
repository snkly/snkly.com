const {src, dest, task, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

// File paths
const styleSrc = 'src/scss/*.scss';
const styleDist = './dist/css/';
const htmlSrc = 'src/*.html';
const htmlDist = './dist/';

// Watch paths
const styleWatch = 'src/scss/**/*.scss';
const htmlWatch = 'src/*.html';

// Server
function server() {
  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  });
};

// Reload server
function reload(done) {
  browserSync.reload();
  done();
}

// Build styles
function css(done) {
  src(styleSrc)
    .pipe(sourcemaps.init())
    .pipe(sass({
      errorLogToConsole: true,
      outputStyle: 'compressed'
    }))
    .on('error', console.error.bind(console))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(dest(styleDist))
    .pipe(browserSync.stream())
  done();
};

// Build HTML
function html(done) {
  src(htmlSrc)
    .pipe(dest(htmlDist))
    .pipe(browserSync.stream())
  done();
};

// Watch files
function watchFiles() {
  //watch(htmlWatch).on('change', browserSync.reload);
  watch(htmlWatch, series(html, reload));
  watch(styleWatch, series(css, reload));
}

// Tasks
task('css', css);
task('html', html);
//task('watch', parallel(browser_sync, watch_files));
task('default', series(html, css, parallel(server, watchFiles)));