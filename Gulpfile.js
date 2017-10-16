const gulp = require('gulp')
const cluster = require('cluster')

const buildFilesTask = () => (
  gulp.src(['**/*.js'])
  .pipe(
    require('gulp-babel')({})
  )
  .pipe(gulp.dest('dist'))
)

gulp.task('build-scripts', buildFilesTask)
