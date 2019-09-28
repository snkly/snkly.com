const {src, dest, task, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

// File paths
const styleSrc = 'src/scss/styles.scss';
const styleDist = './dist/css/';
const jsSrc = 'src/js/*.js';
const jsDist = './dist/js/';
const htmlSrc = 'src/*.html';
const htmlDist = './dist/';

// Watch paths
const styleWatch = 'src/scss/*.scss';
const jsWatch = 'src/js/*.js';
const htmlWatch = 'src/*.html';

function clean() {
  return del(['dist']);
}

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
    .pipe(autoprefixer())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(dest(styleDist))
    .pipe(browserSync.stream())
  done();
};

// Build JS
function js(done) {
  src(jsSrc)
    .pipe(uglify())
    .on('error', console.error.bind(console))
    .pipe(rename("script.js"))
    .pipe(dest(jsDist))
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
  watch(styleWatch, series(css, reload));
  watch(jsWatch, series(js, reload));
  //watch(htmlWatch).on('change', browserSync.reload);
  watch(htmlWatch, series(html, reload));
}

// Tasks
task('clean', clean);
task('css', css);
task('js', js);
task('html', html);
//task('watch', parallel(browser_sync, watch_files));
task('default', series(clean, html, parallel(css, js), parallel(server, watchFiles)));
task('cook', series(clean, html, parallel(css, js)));