const gulp = require('gulp');
const minifyCss = require('gulp-minify-css')
const minifyHtml = require('gulp-minify-html')
const rename = require('gulp-rename')

gulp.task('minify-html', function() {
    gulp.src('./views/*.html')
        .pipe(minifyHtml())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./views/dist'));
        
})

gulp.task('minify-css', function () {
    gulp.src('./public/css/*.css')
    .pipe(minifyCss())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./public/css'));
});