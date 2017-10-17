require('../libs/express-allow-async')

const moment = require('moment-timezone')
require('moment/locale/es')

moment.tz.setDefault('America/Santiago')

// SERVER
const express = require('express')
// const React = require('react')
// const util = require('util')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const url = require('url')
const bodyParser = require('body-parser')
const {injectGlobal} = require('styled-components')

const {default: reset} = require('styled-reset')

const store = require('../libs/store')

const SECRET_KEY_SESSION = process.env.SECRET_KEY_SESSION || '123456'

injectGlobal`
  ${reset}
  @import url('https://fonts.googleapis.com/css?family=Roboto');

  body {
    margin: 0px;
  }
`

const app = express()

app.use(session({
  secret: SECRET_KEY_SESSION,
  store: new MongoStore({mongooseConnection: store.con}),
}))

app.use(bodyParser.json())

// Plugins to express
app.use(require('../libs/express-debug'))
app.use(require('../libs/express-render-react'))

app.use(express.static('public'))

// Routers
app.use(require('./routers/home/home'))
app.use(require('./routers/login/login'))
app.use(require('./routers/templates/templates'))
app.use(require('./routers/certs/certs'))

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