const gulp = require("gulp");
const sass = require('gulp-sass');
const browsersync = require('browser-sync');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');


function css(){
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(concat('main.css'))
        .pipe(autoprefixer({ grid: "autoplace" }))
        .pipe(gulp.dest('app/css'))
        .pipe(browsersync.stream());
}


function scripts() {
    return gulp.src('app/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(babel({
            presets: ['babel-preset-env']
        }))
        .pipe(gulp.dest('app/babel-js'))
        .pipe(browsersync.stream()) 
}

function code() {
    return gulp.src('app/*.html')
        .pipe(browsersync.stream()) 
}


function browserSync(cb){
    browsersync.init({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
    cb();
}


function watchFiles(){
    gulp.watch('app/sass/**/*.sass', css);
    gulp.watch('app/*.html', code);
    gulp.watch('app/js/**/*.js', scripts);

}

const watch = gulp.parallel(watchFiles, browserSync);

exports.css = css;
exports.js = scripts;
exports.code = code;
exports.watch = watch;