const gulp = require('gulp')
const cluster = require('cluster')
const fs = require('fs')

const buildFilesTask = () => (
  gulp.src(['libs/**/*.js', 'src/**/*.js'], { base: __dirname })
  .pipe(
    require('gulp-babel')(
      {
        babelrc: false,
        'presets': [
          ['env', {
            'targets': {
              'node': '8.6'
            }
          }],
          'react',
          'flow',
          'stage-0'
        ],
        'plugins': [
          ['babel-plugin-styled-components', {
            'ssr': true
          }],
          ['flow-runtime', {
            'assert': false,
            'warn': false,
            'annotate': false
          }]
        ]
      }
    )
  )
  .pipe(gulp.dest('dist'))
)

const copyFileTask = () => (
  gulp.src(['libs/**/templates/*/*.+(png|ttf)','package.json', 'package-lock.json', 'public/*'], { base: __dirname })
  .pipe(gulp.dest('dist'))
)

gulp.task('dist-scripts', buildFilesTask)
gulp.task('copy-package-file', copyFileTask)

gulp.task('dist', [
  'copy-package-file',
  'dist-scripts'
])
