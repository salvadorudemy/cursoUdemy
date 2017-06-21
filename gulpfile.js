"use strict"

// librerias requeridas (done)
// tareas *
// whatcher

const gulp         = require("gulp"),
      browserSync  = require("browser-sync").create(),
      autoprefixer = require("gulp-autoprefixer"),
      babel        = require("gulp-babel"),
      cleanCss     = require("gulp-clean-css"),
      concat       = require("gulp-concat"),
      htmlmin      = require("gulp-htmlmin"),
      imagemin     = require("gulp-imagemin"),
      plumber      = require("gulp-plumber"),
      pug          = require("gulp-pug"),
      sass         = require("gulp-sass"),
      svgmin       = require("gulp-svgmin"),
      uglify       = require("gulp-uglify"),
      useref       = require("gulp-useref"),
      webp         = require("gulp-webp"),
      pngquant     = require("imagemin-pngquant"),
      dir          = {
        src         : "src",
        development : "build/development",
        production  : "build/production",
        nm          : "node_modules",
      },
      files = {
        CSS : [
          `${dir.nm}/animate.css/animate.min.css`,
          `${dir.nm}/font-awesome/css/font-awesome.min.css`,
          `${dir.nm}/owl.carousel/dist/assets/owl.carousel.min.css`,
          `${dir.nm}/owl.carousel/dist/assets/owl.theme.default.min.css`,
          `${dir.nm}/magnific-popup/dist/magnific-popup.css`,
          "css/main.css",
        ],
        mCSS : "main.min.css",
        JS : [
          `${dir.nm}/jquery/dist/jquery.min.js`,
          `${dir.nm}/wowjs/dist/wow.min.js`,
          `${dir.nm}/jquery-sticky/jquery.sticky.js`,
          `${dir.nm}/isotope-layout/dist/isotope.pkgd.min.js`,
          `${dir.nm}/jquery-countto/jquery.countTo.js`,
          `${dir.nm}/jquery-inview/jquery.inview.min.js`,
          `${dir.nm}/jquery.countdown/jquery.countdown.js`,
          `${dir.nm}/magnific-popup/dist/jquery.magnific-popup.min.js`,
          `${dir.nm}/owl.carousel/dist/owl.carousel.min.js`,
          "js/main.js"
        ],
        mJS : "mian.min.js"
      },
      opts = {
        pug : {
          pretty : true,
          locals : {
            files : files,
          }
        },
        sass : { outputStyle : 'compressed' }
      };

// Task Pug
// =======
gulp.task("pug",() => {
  gulp.src( `${dir.src}/templates/*.pug` )
  .pipe(plumber())
  .pipe(pug(opts.pug))
  .pipe(gulp.dest(`${dir.development}`))
  .pipe(browserSync.reload({ stream : true }));
});

// Taks SASS
// =========
gulp.task("sass",() => {
  return gulp.src(`${dir.src}/sass/**/*.scss`)
  .pipe(plumber())
  .pipe(sass(opts.sass))
  .pipe(gulp.dest(`${dir.development}/css`))
  .pipe(browserSync.reload({ stream : true }));
});


// Task server
// ==========
gulp.task("server", () => {
  browserSync.init({
    server : {
      baseDir           : `${dir.development}`,
      routes            : {
        "/node_modules" : `${dir.nm}`
      }
    }
  });
});

// whatcher
// ========
gulp.task("watch", () => {
  gulp.watch("src/templates/**/*.pug", ["pug"]);
  gulp.watch(`${dir.src}/sass/**/*.scss`, ["sass"]);
});


// Tasks
// =====
gulp.task("default", ["pug", "sass", "watch", "server" ]);
