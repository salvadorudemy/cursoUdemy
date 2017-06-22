"use strict"

// librerias requeridas (done)
// tareas *
// whatcher

const gulp         = require("gulp"),
      browserSync  = require("browser-sync").create(),
      autoprefixer = require("gulp-autoprefixer"),
      babel        = require("gulp-babel"),
      celanCSS     = require("gulp-clean-css"),
      concat       = require("gulp-concat"),
      htmlmin      = require("gulp-htmlmin"),
      imagemin     = require("gulp-imagemin"),
      plumber      = require("gulp-plumber"),
      uncss        = require("gulp-uncss"),
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
        sass : { outputStyle : 'compressed' },
        es6 : { presets : ["es2015"] },
        imagemin : {
          progressive : true,
          use : [pngquant()],
        },
        svgming :{
          plugins : [
            { convertColors : false },
            { removeAttrs : { attrs : [ 'fill' ]}}
          ]
        },
        uncss : { html : [ `${dir.development}/*.html` ]},
        autoprefixer : {
          browsers : [ 'last 5 versions' ],
          cascade : false
        },
        htmlmin : { collapseWhitespace : true }
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
  gulp.src(`${dir.src}/sass/**/*.scss`)
  .pipe(plumber())
  .pipe(sass(opts.sass))
  .pipe(gulp.dest(`${dir.development}/css`))
  .pipe(browserSync.reload({ stream : true }));
});

//Task JS
// ======
gulp.task("js",() => {
  gulp.src(`${dir.src}/js/**/*.js`)
  .pipe(plumber())
  .pipe(babel(opts.es6))
  .pipe(gulp.dest(`${dir.development}/js`))
  .pipe(browserSync.reload({ stream : true }));
});

// Taks image
// ==========
gulp.task("img",() => {
  gulp.src(`${dir.src}/img/**/*.+(png|jpg|jpeg|gif)`)
  .pipe(plumber())
  .pipe(imagemin(opts.imagemin))
  .pipe(gulp.dest(`${dir.development}/img`))
});

// Task svg
// ========
gulp.task( 'svg', () => {
  gulp.src(`${dir.src}/img/**/*.svg)`)
  .pipe( plumber())
  .pipe( svgmin( opts.svgmin ))
  .pipe( gulp.dest(`${dir.development}/img/svg` ))
})

// Taks webp
// =========
gulp.task("webp",() => {
  gulp.src(`${dir.src}/img/**/*.+(png|jpg|jpeg|gif)`)
  .pipe(plumber())
  .pipe(webp())
  .pipe(gulp.dest(`${dir.development}/img/webp`))
});


// TRAREAS DE PRORDUCION
// Task css
// ========
gulp.task( 'cssprod', () => {
  gulp.src( files.CSS )
  .pipe( concat( files.mCSS ))
  .pipe( uncss( opts.uncss ))
  .pipe( autoprefixer( opts.autoprefixer ))
  .pipe( celanCSS() )
  .pipe( gulp.dest( `${dir.production}/css` ));
})

// Task js
// =======

gulp.task( 'jsprod', () => {
  gulp.src( files.JS )
  .pipe( concat( files.mJS ))
  .pipe( uglify() )
  .pipe( gulp.dest( `${dir.production}/js` ))
})

// Task html
// =========
gulp.task( 'htmlprod', () => {
  gulp.src( `${dir.development}/*.html`)
  .pipe( useref() )
  .pipe( htmlmin( opts.htmlmin ))
  .pipe( gulp.dest( `${dir.development}`))
})

// Taks image
// ==========
gulp.task("imgprod",() => {
  gulp.src(`${dir.development}/img/**/*.+(png|jpg|jpeg|gif)`)
  .pipe(gulp.dest(`${dir.production}/img`))
});



// TAREAS DEL SERVIDOR
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
  gulp.watch(`${dir.src}/js/**/*.js`, ["js"]);
});


// Tasks
// =====
gulp.task( "default" , ["pug", "sass", "js", "watch", "server" ]);
gulp.task( "images" , [ "img", "webp", "svg" ]);
gulp.task( "production", [ "jsprod", "cssprod", "imgprod", "htmlprod"])
