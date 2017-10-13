const React = require('react')
const router = require('express').Router()
const get = require('lodash/get')
const fs = require('fs')
const path = require('path')
const os = require('os')
const bodyParser = require('body-parser')
const {default: styled} = require('styled-components')

require('../../../libs/express-allow-async')(router)

const {templates} = require('../../../libs/templates/templates')
const {Cert} = require('../../../libs/store')

const {MenuTop, LinkElement} = require('../../components/MenuTop')
const {ContainerBlockElements} = require('../../components/ContainerBlockElements')
const {BodyContainer} = require('../../components/BodyContainer')
const {Input} = require('../../components/Input')
const {Btn} = require('../../components/Btn')

const ContainerCardCertElement = styled.a`
  padding: 10px;
  display: flex;
  text-decoration: none;

  position: relative;

  &:before {
    content: "";
    position: absolute;
    background-color: #C4C4C4;
    width: 100%;
    width: calc(100% - 128px);
    height: 1px;
    bottom: 0px;
    left: 118px;
  }
`

const ContainerImageCertElement = styled.div`
  background-size: cover;
  width: 88px;
  height: 68px;
`

const ContainerTitleCertElement = styled.span`
  flex: 1;
  padding-left: 20px;
  align-self: center;

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 18px;

  color: #222222;

  text-decorator: none;
`

const CertElement = ({href, srcImg, title}) => (
  <ContainerCardCertElement href={href}>
    <ContainerImageCertElement style={{backgroundImage: `url(${srcImg})`}} />
    <ContainerTitleCertElement>{title}</ContainerTitleCertElement>
  </ContainerCardCertElement>
)

const Templates = ({templates}) => {
  return (
    <BodyContainer>
      <MenuTop>
        <LinkElement>Certificados</LinkElement>
        <LinkElement stylefloat='right' href='/logout'>Salir</LinkElement>
      </MenuTop>

      <ContainerBlockElements>

        {
          templates.map(({id, link, title, image}) => (
            <CertElement
              key={id}
              href={link}
              title={title}
              srcImg={image}
            />
          ))
        }

      </ContainerBlockElements>

    </BodyContainer>
  )
}

const CreateTemplate = ({urlSubmit, fields}) => {
  return (
    <BodyContainer>
      <MenuTop>
        <LinkElement href='/templates'>Plantillas</LinkElement>
        <LinkElement href='/logout' stylefloat='right'>Salir</LinkElement>
      </MenuTop>

      <form action={urlSubmit} method='POST'>

        {
          fields.map(field => (
            <ContainerBlockElements key={field.name} marginTop='20px'>
              <Input name={field.name} label={field.title} type={field.type} required />
            </ContainerBlockElements>
          ))
        }

        <ContainerBlockElements marginTop='30px' align='center'>
          <Btn type='submit' text='Crear certificado' />
        </ContainerBlockElements>

      </form>

    </BodyContainer>
  )
}

// resource templates
const getTemplates = () => templates

const policyRequireSession = (req, res, next) => {
  if (get(req, ['session', 'auth', 'ok']) !== true) {
    return res.redirect('/', 302)
  }
  return next()
}

router.get('/templates', policyRequireSession)

router.get('/templates', (req, res, next) => {
  const templates = getTemplates()
    .map(({meta:template}) => {
      template.link = `/create/${template.id}`

      return template
    })

  res.renderReact(
    <Templates templates={templates} />
  )
})

const createRender = () => (req, res, next) => {
  const {idTemplate} = req.params

  const template = getTemplates().find(({meta:template}) => template.id === idTemplate)

  res.renderReact(
    <CreateTemplate
      urlSubmit={`/create/${idTemplate}`}
      fields={template.meta.fields}
    />,
    {
      title: template.meta.title
    }
  )
}

router.get('/create/:idTemplate', policyRequireSession)
router.get('/create/:idTemplate', (req, res, next) => createRender()(req, res, next))

router.post('/create/:idTemplate', bodyParser.urlencoded({ extended: false }))
router.postAsync('/create/:idTemplate', async (req, res, next) => {
  const {idTemplate} = req.params
  const template = getTemplates().find(({meta:template}) => template.id === idTemplate)

  const {codeOtec, courseName, fullName, rut} = req.body

  const data = {}
  for (const field of template.meta.fields) {
    if ( (field.name in req.body) === false ) {
      throw new TypeError(`Require "${field.name}" param.`)
    } else {
      data[field.name] = req.body[field.name]
    }
  }

  // Folder to out files
  const PATHSTOREPDF = os.tmpdir()

  const nCert = Number(await Cert.count()) + 21230
  data.code = nCert
  data.path_pdf_file = path.resolve(PATHSTOREPDF, `./cert-${nCert}.pdf`)

  const cert = await (new Cert(data)).save()

  console.log(cert)

  const streams = await template.create({
    ...cert.toObject(),
    stream: fs.createWriteStream(cert.path_pdf_file),
  })

  return res.redirect(`/certs/${cert.code}`, 302)
})

module.exports = router
