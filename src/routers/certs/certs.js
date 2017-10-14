// @flow
const t = require('flow-runtime')
const router = require('express').Router()
require('../../../libs/express-allow-async')(router)
const fs = require('fs')
const toLower = require('lodash/toLower')
const get = require('lodash/get')
const path = require('path')
const React = require('react')
const {Cert} = require('../../../libs/store')

const {CertView, CertsView} = require('./certViews')

const policyRequireLogin = (req, res, next) => {
  if (get(req, ['session', 'auth', 'ok']) !== true) {
    return res.redirect('/', 302)
  }
  return next()
}

router.get('/certs', policyRequireLogin)
router.getAsync('/certs', async (req, res, next) => {
  const {filter} = req.query
  const filterLower = toLower(filter)
  let certs = await Cert.find({})

  // Autocomplete data
  const autocomplete = new Set()

  certs.forEach(cert => {
    autocomplete.add(cert._template.title)
    autocomplete.add(cert.fullName)
  })

  if (filter) {
    certs = certs.filter(cert => {
      if (toLower(cert.fullName).indexOf(filterLower) !== -1) {
        return true
      }

      if (toLower(cert._template.title) === filterLower) {
        return true
      }

      return false
    })
  }

  res.renderReact(<CertsView certs={certs} autocompleteSearch={autocomplete.values()} defaultValueSearch={filter}/>)
})

router.getAsync('/certs/:idCert', async (req, res, next) => {
  const {idCert} = req.params
  const authenticated = get(req, ['session', 'auth', 'ok'], false)

  const cert = await Cert.findOne({code: idCert})

  if (cert === null) return next()

  console.log(authenticated)

  res.renderReact(
    <CertView cert={cert} rawLink={`/certs/${idCert}/raw`} authenticatedMode={authenticated}/>
  )
})

router.getAsync('/certs/:idCert/raw', async (req, res, next) => {
  const {idCert} = req.params

  const cert = await Cert.findOne({code: idCert})

  return res.redirect(`/certs/${idCert}/raw/${cert.code}-${cert.fullName}.pdf`, 301)
})

router.getAsync('/certs/:idCert/raw/:any', async (req, res, next) => {
  const {idCert} = req.params

  const cert = await Cert.findOne({code: idCert})

  if (cert === null) return next()

  const pathfile = path.resolve(`${cert.path_pdf_file}`)

  await new Promise((resolve, reject) => {
    fs.createReadStream(pathfile)
    .on('error', reject)
    .pipe(res)
    .on('finish', () => resolve())
  })
})

module.exports = router
