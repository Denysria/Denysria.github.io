var gulp = require('gulp');
var gutil = require('gulp-util');
var postcss = require('gulp-postcss');
var gcmq = require('gulp-group-css-media-queries');
var autoprefix = require('autoprefixer');
var animation = require('postcss-animation');
var sass = require('gulp-sass');
var minifyCss = require('gulp-clean-css');
var spritesmithMulti = require('gulp.spritesmith-multi');
var tinypng = require('gulp-tinypng-extended');
var buffer = require('gulp-buffer');
var spritesmash = require('gulp-spritesmash');
var gulpif = require('gulp-if');
var clean = require('gulp-clean');
var lost = require('lost');
var rigger = require('gulp-rigger');
// var gridKiss = require('postcss-grid-kiss');


/* WATCH MAIN */
gulp.task('watch', ['sass', 'html'], function() {
    gulp.watch('sass/**/?(*.sass|*.scss)', ['sass']);
    gulp.watch('../build/src/**/*.html', ['html']);
});


gulp.task('watch-html', ['html'], function() {
    gulp.watch('../build/src/**/*.html', ['html']);
});


var path = {
    build: {
        html: '../build/'
    },
    src: {
        html: ['src/**/*.html', '!src/template/*.html']
    },
    watch: {
        html: 'src/**/*.html'
    },
    clean: './build'
};


gulp.task('clean-html', function () {
    return gulp.src(['../build/**/*.html', '!../build/src/**/*.html', '!../build/node_modules/**/*.html'], {read: false})
        .pipe(clean());
});

gulp.task('html', ['clean-html'], function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html));
});

/* SASS MAIN*/
gulp.task('sass', function(){
    return gulp.src('sass/**/?(*.sass|*.scss)')
        .pipe(sass().on('error', sass.logError))
        .on('error', gutil.log)
        .pipe(gulp.dest('./stylesheets'))
});


//CLEAR SPRITES PATH
gulp.task('clean', function () {
    return gulp.src('./images/icons/*.png', {read: false})
        .pipe(clean());
});

//CREATE NEW SPRITES
gulp.task('sprite', ['clean'],function () {
    return gulp.src(['images/icons/*/*.png'])
        .pipe(spritesmithMulti({
            spritesmith:  function(options, sprite) {
                options.cssName = '_' + sprite + '.scss';
                options.cssTemplate = './autoria-sprite-template.mustache';
                options.padding = 2;
            }
        }))
        .pipe(buffer())
        .pipe(spritesmash())
        .pipe(gulpif('*.png', gulp.dest('./images/icons/')))
        .pipe(gulpif('*.scss', gulp.dest('./sass/sprites/')));
});

/*Keys for TinyPNG*/

gulp.task('sprite-min', function () {
    gulp.src(['images/icons/*'])
        .pipe(tinypng({
            key: 'hL2H7F6T5Wtw90hWbjEV2s1WIT0LY6yY',
            sigFile: 'images/icons/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('images/icons'))
});

// COMPILE PRODUCTION
gulp.task('production', function(){
    var processors = [
        lost(),
        animation(),
        lost(),
        autoprefix({ browsers: ['last 4 versions'], cascade: false })
    ];
    return gulp.src(['./stylesheets/**/*.css'])
        .pipe(postcss(processors))
        .pipe(gcmq())
        .pipe(minifyCss())
        .pipe(gulp.dest('./stylesheets'));
});

// COMPILE CRITICAL
gulp.task('critical', function () {
    var processors = [
        autoprefix({browsers: ['last 4 versions'], cascade: false })
    ];
    return gulp.src('./sass/criticalcss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gcmq())
        .pipe(minifyCss())
        .pipe(gulp.dest('./stylesheets/criticalcss'));
});

// DEFAULT TASK
gulp.task('default', ['sass', 'sprite', 'critical', 'production']);

