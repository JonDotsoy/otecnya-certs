const gulp = require('gulp')
const cluster = require('cluster')

gulp.task('build-demo-file', async function buildDemoFile () {
  cluster.settings.exec = `${__dirname}/runDemoBuild.js`
  cluster.settings.stdio = process.stdio

  await new Promise((resolve) => {
    const worker = cluster.fork()

    worker.on('exit', (code, signal) => {
      console.log(code, signal)
      resolve()
    })

  })
})

gulp.task('build-demo-file:watch', ['build-demo-file'], () => {
  gulp.watch(['libs/**/*.js', 'runDemoBuild.js'], ['build-demo-file'])
})


