const gulp = require('gulp')
const http = require('http')
const browserSync = require('browser-sync')

const cluster = require('cluster')
const fs = require('fs')

const bs = browserSync.create()

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

const serverWatch = () => {
  bs.init({
    proxy: 'http://localhost:3000'
  })
}

const webTestOpen = (url) => {
  const pingTest = async () => {
    await new Promise((resolve, reject) => {
      http.get(url, (res) => {
          resolve()
        })
        .on('error', reject)
    })
  }

  return async () => {
    while (true) {
      try {
        await pingTest()
        break
      } catch (ex) {
        // console.error(ex)
      }
    }
  }
}

const testServerConnected = webTestOpen('http://localhost:3000')

const forkServer = (done) => {
  const nodemon = require('nodemon')

  nodemon(`--require babel-core/register src/server`)

  nodemon.once('start', async () => {
    await testServerConnected()
    done()
    nodemon.on('start', async () => {
      await testServerConnected()
      bs.reload()
    })
  })
}

gulp.task('test-server-connected', testServerConnected)
gulp.task('fork-server', forkServer)
gulp.task('server-watch', ['fork-server', 'test-server-connected'], serverWatch)
gulp.task('dist-scripts', buildFilesTask)
gulp.task('copy-package-file', copyFileTask)

gulp.task('dist', [
  'copy-package-file',
  'dist-scripts'
])

