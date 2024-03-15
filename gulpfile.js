/*
npm i -g gulp
npm i browser-sync gulp-beautify gulp-file-include gulp-autoprefixer gulp-plumber gulp-if delete
*/

const gulp = require("gulp");
const sync = require("browser-sync").create();
const beautify = require("gulp-beautify");
const include = require("gulp-file-include");
const prefix = require("gulp-autoprefixer");
const plumber = require("gulp-plumber");
const gulpIf = require("gulp-if");
const del = require("delete");
const paths = require("./config.js");
const { series, parallel, watch } = gulp;

function browserSync(done) {
  sync.init({
    port: 8080,
    server: {
      baseDir: "./",
      index: "index.html",
    },
    browser: ["google chrome", "chrome"],
    // browser: ['google chrome', 'chrome', 'firefox', 'iexplore', 'opera', 'safari']
  });
  done();
}

function reload(done) {
  sync.reload();
  done();
}

function init(done) {
  del(paths.devAll, function (err, deleted) {
    if (err) throw err;
    console.log(deleted);
  });
  done();
}

function htmlBuild() {
  return gulp
    .src(paths.srcPath.html)
    .pipe(plumber())
    .pipe(
      include({
        prefix: "@@",
        basepath: paths.srcPath.include,
      })
    )
    .pipe(beautify.html({ indent_size: 2 }))
    .pipe(gulp.dest(paths.devPath.html));
}

function cssBuild() {
  return gulp
    .src(paths.srcPath.css, { since: gulp.lastRun(cssBuild) })
    .pipe(plumber())
    .pipe(
      prefix({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(beautify.css({ indent_size: 2 }))
    .pipe(gulp.dest(paths.devPath.css));
}

function jsBuild() {
  return gulp
    .src(paths.srcPath.js, { since: gulp.lastRun(jsBuild) })
    .pipe(plumber())
    .pipe(
      gulpIf(
        (file) => !file.path.endsWith(".min.js"),
        beautify({ indent_size: 2 })
      )
    )
    .pipe(gulp.dest(paths.devPath.js));
}

function imageBuild() {
  return gulp
    .src(paths.srcPath.img, { since: gulp.lastRun(imageBuild) })
    .pipe(plumber())
    .pipe(gulp.dest(paths.devPath.img));
}

function fontBuild() {
  return gulp
    .src(paths.srcPath.font, { since: gulp.lastRun(fontBuild) })
    .pipe(plumber())
    .pipe(gulp.dest(paths.devPath.font));
}

function watcher() {
  watch(paths.srcPath.html, series(htmlBuild, reload));
  watch(paths.srcPath.include, series(htmlBuild, reload));
  watch(paths.srcPath.css, series(cssBuild, reload));
  watch(paths.srcPath.js, series(jsBuild, reload));
  watch(paths.srcPath.img, series(imageBuild, reload));
  watch(paths.srcPath.font, series(fontBuild, reload));
}

exports.default = series(
  init,
  parallel(htmlBuild, cssBuild, jsBuild, imageBuild, fontBuild),
  browserSync,
  watcher
);
