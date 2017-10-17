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
const {templates} = require('../../../libs/templates/templates')

const normalizeCert = (cert) => {
  const prevTemplate = templates.find(({meta:{id}}) => cert._template.id === id)

  const template = prevTemplate.meta

  const newCert = {
    ...cert.toObject(),
    _template: template || cert._template
  }

  return newCert
}

const {CertView, CertsView, DeleteCertView} = require('./certViews')

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

router.postAsync('/certs/:idCert/delete', async (req, res, next) => {
  const {idCert} = req.params
  const authenticated = get(req, ['session', 'auth', 'ok'], false)

  const cert = await Cert.findOne({code: idCert})

  if (cert === null) {
    return next()
  }

  await Cert.remove({code: idCert})

  res.redirect(`/certs`, 301)
})

router.getAsync('/certs/:idCert/delete', async (req, res, next) => {
  const {idCert} = req.params
  const authenticated = get(req, ['session', 'auth', 'ok'], false)

  const cert = await Cert.findOne({code: idCert})

  if (cert === null) {
    return next()
  }

  const nextCert = normalizeCert(cert)

  res.renderReact(
    <DeleteCertView cert={nextCert} certLink={`/certs/${idCert}`} submitDeleteLink={`/certs/${idCert}/delete`} />
  )
})

router.getAsync('/certs/:idCert', async (req, res, next) => {
  const {idCert} = req.params
  const authenticated = get(req, ['session', 'auth', 'ok'], false)

  const cert = await Cert.findOne({code: idCert})

  // return res.json(cert)

  if (cert === null) return next()

  const nextCert = normalizeCert(cert)

  // return res.json(nextCert)

  res.renderReact(
    <CertView cert={nextCert} deleteLink={`/certs/${idCert}/delete`} rawLink={`/certs/${idCert}/raw`} authenticatedMode={authenticated}/>
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
