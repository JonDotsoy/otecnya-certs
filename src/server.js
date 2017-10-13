// SERVER
const express = require('express')
// const React = require('react')
// const util = require('util')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const url = require('url')
const bodyParser = require('body-parser')
const {injectGlobal} = require('styled-components')

const store = require('../libs/store')

const SECRET_KEY_SESSION = '12345'

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Roboto');

  body {
    margin: 0px;
  }
`

const app = express()

require('../libs/express-allow-async')(app)

app.use(session({
  secret: SECRET_KEY_SESSION,
  store: new MongoStore({mongooseConnection: store.con}),
}))

app.use(bodyParser.json())

app.use(require('../libs/express-debug'))
app.use(require('../libs/express-render-react'))

app.use(express.static('public'))

app.use(require('./routers/home/home'))
app.use(require('./routers/login/login'))
app.use(require('./routers/templates/templates'))
app.use(require('./routers/certs/certs'))

// https://cert.otecnya.cl/templates

// app.get('/api', (req, res, next) => {
//   const {query} = req
//   const code = query.code
//   const codeOtec = query.codeOtec
//   const courseName = query.courseName
//   const fullName = query.fullName
//   const rut = query.rut

//   if (!code) throw new TypeError(`Require "code" param.`)
//   if (!codeOtec) throw new TypeError(`Require "codeOtec" param.`)
//   if (!courseName) throw new TypeError(`Require "courseName" param.`)
//   if (!fullName) throw new TypeError(`Require "fullName" param.`)
//   if (!rut) throw new TypeError(`Require "rut" param.`)

//   return (async () => {
//     return await otecnyaAprov.create({
//       stream: res,
//       code,
//       codeOtec,
//       courseName,
//       fullName,
//       rut
//     })
//   })()
//   .then(() => {
//     next()
//   })
//   .catch((err) => {
//     next(err)
//   })
// })

/*app.use(function (err, req, res, next) {
  console.error(err)

  res
  .status(500)
  .json({
    err: {
      code: err.code || 500,
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV !== 'production' ? util.inspect(err.stack) : undefined
    }
  })
})*/

const run = async () => {
  await store.ready

  const server = app.listen(3000, '0.0.0.0', () => {
    const {address, port} = server.address()

    const publicURL = url.format({
      protocol: 'http',
      slashes: true,
      hostname: address,
      port
    })

    console.log(`Server Ready 😀: ${publicURL}`)
  })

}


run()
.catch(console.error)