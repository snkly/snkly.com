const {src, dest, task, watch, series, parallel } = require('gulp'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  browserSync = require('browser-sync').create(),
  svgSprite = require('gulp-svg-sprite');

// File paths
const dist = './dist/',
  styleSrc = 'src/scss/styles.scss',
  styleDist = './dist/css/',
  jsSrc = 'src/js/*.js',
  jsDist = './dist/js/',
  htmlSrc = 'src/*.html',
  htmlDist = dist,
  svgSrc = 'src/icons/*.svg',
  svgDist = dist;

// Watch paths
const styleWatch = 'src/scss/*.scss',
  jsWatch = 'src/js/*.js',
  htmlWatch = 'src/*.html';

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

// Build SVG's
function svg(done) {
  src(svgSrc)
    .pipe(svgSprite({
      mode: {
        css: {
          render: {
            css: true
          },
          example: true
        }
      },
      shape: {
        dimension: {
          attributes: true,
          maxWidth: 32
        },
        spacing: {
          padding: [6, 3, 6, 3]
        }
      }
    }))
    .pipe(dest(svgDist));
  done();
}

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
task('svg', svg);
//task('watch', parallel(browser_sync, watch_files));
task('default', series(clean, html, parallel(css, js, svg), parallel(server, watchFiles)));
task('cook', series(clean, html, parallel(css, js, svg)));