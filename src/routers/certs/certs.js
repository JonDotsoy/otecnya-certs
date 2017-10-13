const router = require('express').Router()
const fs = require('fs')
const path = require('path')
const React = require('react')
const {default: styled} = require('styled-components')

const {MenuTop, LinkElement} = require('../../components/MenuTop')
const {ContainerBlockElements} = require('../../components/ContainerBlockElements')
const {BodyContainer} = require('../../components/BodyContainer')
const {Input} = require('../../components/Input')
const {Btn} = require('../../components/Btn')

const Title = styled.h1`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 24px;

  color: #222222;
`

const FieldDataValue = styled.p`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 20px;

  color: #222222;
  margin: 0px;
  margin-bottom: 20px;
`

const FieldDataTitle = styled.h3`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  line-height: normal;
  font-size: 20px;

  color: #222222;
  margin: 0px;
  margin-bottom: 10px;
`

const FieldDataContainer = ({title, value}) => (
  <ContainerBlockElements>
    <FieldDataTitle>{title}</FieldDataTitle>
    <FieldDataValue>{value}</FieldDataValue>
  </ContainerBlockElements>
)

const Cert = ({cert, rawLink}) => {
  return (
    <BodyContainer>

      <MenuTop>
        <LinkElement>Plantillas</LinkElement>
        <LinkElement stylefloat='right'>Salir</LinkElement>
      </MenuTop>

      <ContainerBlockElements>
        <Title>Certificado Aprovatorio</Title>
      </ContainerBlockElements>

      {
        cert.data.map((d) => (
          <FieldDataContainer
            key={d.name}
            title={d.title}
            value={d.value}
          />
        ))
      }

      <ContainerBlockElements>
        <Btn text='Descargar' style={{'marginRight': '10px'}} href={rawLink}/>
        <Btn text='Eliminar' priority='danger' />
      </ContainerBlockElements>

      <ContainerBlockElements marginTop='30px'>
        <Input label='Enviar por email' placeholder='mario@gmail.com' />
      </ContainerBlockElements>

      <ContainerBlockElements marginTop='20px'>
        <Btn text='Enviar Copia' />
      </ContainerBlockElements>

    </BodyContainer>
  )
}

const getCert = (idCert) => {
  return {
    id: '1234567',
    data: [
      {
        name: 'name',
        title: 'Nombre Completo',
        type: 'text',
        value: 'Jacobo Luis Cristóbal'
      },
      {
        name: 'rut',
        title: 'RUT',
        type: 'text',
        value: '13644241-4'
      },
      {
        name: 'courseName',
        title: 'Nombre del curso',
        type: 'text',
        value: 'Manejo A La Defensiva En Alto Montaña'
      },
      {
        name: 'codeOtec',
        title: 'Codigo de la OTEC',
        type: 'text',
        value: '111111'
      },
      {
        name: 'codeCert',
        title: 'Codigo del Certificado',
        type: 'text',
        value: '1234567'
      }
    ],
    template: {
      id: '1111111',
      title: 'Certificado Aprovatorio',
      fields: [/* ... */]
    },
    certPath: 'a path'// Ej. '/data/certs_raw/12345.pdf'
  }
}

router.get('/certs/:idCert', (req, res, next) => {
  const {idCert} = req.params

  const cert = getCert(idCert)

  res.renderReact(
    <Cert cert={cert} rawLink={`/certs/${idCert}/raw`} />
  )
})

router.get('/certs/:idCert/raw', (req, res, next) => {
  const pathfile = path.resolve(__dirname,'../../../out.pdf')

  fs.createReadStream(pathfile)
  .pipe(res)

})

module.exports = router
