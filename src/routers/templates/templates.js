const React = require('react')
const router = require('express').Router()
const get = require('lodash/get')
const fs = require('fs')
const util = require('util')
const url = require('url')
const path = require('path')
const os = require('os')
const bodyParser = require('body-parser')

require('../../../libs/express-allow-async')(router)

const {templates} = require('../../../libs/templates/templates')
const {Cert} = require('../../../libs/store')

const {TemplatesView, CreateCertView} = require('./templatesView')

const policyRequireSession = (req, res, next) => {
  if (get(req, ['session', 'auth', 'ok']) !== true) {
    return res.redirect('/', 302)
  }
  return next()
}

router.get('/templates', policyRequireSession)

router.get('/templates', (req, res, next) => {
  const dataTemplates = templates.map(({meta}) => ({...meta, link: `/create/${meta.id}`}))

  const view = <TemplatesView templates={dataTemplates} />

  res.renderReact(view)
})

router.getAsync('/templates/preview', async (req, res, next) => {
  const {idTemplate} = req.query

  const template = templates.find(({meta}) => meta.id === idTemplate)

  await template.create({
    ...req.query,
    code: '000000',
    stream: res,
  })

  // return res.json({
  //   query: req.query,
  //   template: util.inspect(),
  // })
})

router.get('/create/:idTemplate', policyRequireSession)
router.get('/create/:idTemplate', (req, res, next) => {
  const {idTemplate} = req.params

  const template = templates.find(({meta}) => meta.id === idTemplate)

  const view = <CreateCertView
    urlSubmit={`/create/${idTemplate}`}
    fields={template.meta.fields}
  />

  res.renderReact(view, { title: template.meta.title })
})

router.post('/create/:idTemplate', bodyParser.urlencoded({ extended: false }))
router.postAsync('/create/:idTemplate', async (req, res, next) => {
  const {idTemplate} = req.params
  const template = templates.find(({meta}) => meta.id === idTemplate)

  if (req.body._preview) {
    return res.redirect(
      url.format({
        pathname: `/templates/preview`,
        query: {
          ...req.body,
          idTemplate,
        },
      }),
      302
    )
  }

  const data = {}

  const {ok, data: cert} = await Cert.manufacture(template, req.body)

  return res.redirect(`/certs/${cert.code}`, 302)
})

module.exports = router
