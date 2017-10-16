const React = require('react')
const router = require('express').Router()

// require('../../../libs/express-allow-async')(router)
const {Home} = require('./homeViews')

const {Cert} = require('../../../libs/store')

router.getAsync('/', async (req, res, next) => {
  const {code} = req.query
  let notFoundCert = false

  if (code) {
    const cert = await Cert.findOne({code})
    if (cert === null) {
      notFoundCert = true
    } else {
      return res.redirect(`/certs/${code}`, 302)
    }
  }

  res.renderReact(<Home notFoundCert={notFoundCert} />)
})

module.exports = router
