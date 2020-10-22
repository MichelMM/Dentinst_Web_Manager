let gulp = require('gulp');
let sass = require('gulp-sass');
let uglifycss = require('gulp-uglifycss');
let uglify = require('gulp-uglify');
let htmlreplace = require('gulp-html-replace');


gulp.task('styles', function() {
  return gulp.src('src/styles/**/*.scss')
    .pipe(sass())
    .pipe(uglifycss())
    .pipe(gulp.dest('public/styles'))
});

// gulp.task('scripts', function() {
//   let project = ts.createProject('tsconfig.json');
//   return project.src()
//     .pipe(project())
//     .pipe(babel({
//       presets: ['@babel/preset-env']
//     }))
//     // .pipe(uglify())
//     .pipe(gulp.dest('dist/js'));
// });

// gulp.task('html', function() {
//   return gulp.src('src/index.html')
//     .pipe(htmlreplace({
//       'js': {
//         src: 'js/app.min.js',
//         tpl: '<script src="%s" type="module"></script>'
//       },
//       'css': 'css/main.css'
//     }))
//     .pipe(gulp.dest('dist'))
// })



gulp.task('default', gulp.series(['styles']));