const SRC = "src",
  DEV = "dev",
  srcPath = {
    html: [`${SRC}/**/*.html`, `!${SRC}/inc/*.html`],
    css: `${SRC}/css/*.css`,
    font: `${SRC}/fonts/*`,
    js: `${SRC}/js/*.js`,
    img: `${SRC}/img/**/*.{png,jpg,jpeg,gif,svg}`,
    include: `${SRC}/inc/`,
  },
  devPath = {
    html: `${DEV}/`,
    css: `${DEV}/css/`,
    font: `${DEV}/fonts/`,
    js: `${DEV}/js/`,
    img: `${DEV}/img/`,
    include: `${DEV}/inc/`,
  },
  devAll = `${DEV}/**/*.*`;

module.exports = {
  srcPath,
  devPath,
  devAll,
};
