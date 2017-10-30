// @flow
import url from 'url'
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
  const autocomplete = new Map()

  certs.forEach(cert => {
    // Added the title template to autocomplete
    if (cert._template.title !== undefined) autocomplete.set(cert._template.title, Object.assign(cert._template.title, {[Symbol.for('typeShow')]: 'Plantilla'}))
    // Added name people to autocomplete
    if (cert.fullName !== undefined) autocomplete.set(cert.fullName, Object.assign(cert.fullName, {[Symbol.for('typeShow')]: 'Nombre'}))
    // Added business to autocomplete
    if (cert.data.business !== undefined) autocomplete.set(cert.data.business, Object.assign(cert.data.business, {[Symbol.for('typeShow')]: 'Empresa'}))
  })

  if (filter) {
    certs = certs.filter(cert => {
      if (toLower(cert.fullName).indexOf(filterLower) !== -1) return true
      if (toLower(cert._template.title) === filterLower) return true
      if (toLower(cert.data.business) === filterLower) return true

      return false
    })
  }

  res.renderReact(<CertsView certs={certs} autocompleteSearch={autocomplete.values()} defaultValueSearch={filter}/>)
})

router.postAsync('/certs/:idCert/delete', policyRequireLogin, async (req, res, next) => {
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
    <CertView cert={nextCert} cloneLink={`/certs/${idCert}/clone`} deleteLink={`/certs/${idCert}/delete`} rawLink={`/certs/${idCert}/raw`} authenticatedMode={authenticated}/>
  )
})

async function routeCloneCert (req, res, next) {
  const {idCert} = req.params

  const cert = await Cert.findOne({code: idCert})

  if (cert === null) return next()

  // return res.json(cert)

  return res.redirect(302, url.format({
    pathname: `/create/${cert._template.id}`,
    query: cert.data
  }))
}

router.getAsync('/certs/:idCert/clone', policyRequireLogin, routeCloneCert)

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
