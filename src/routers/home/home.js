const React = require('react')
const router = require('express').Router()
const {default: styled} = require('styled-components')

require('../../../libs/express-allow-async')(router)

const {Cert} = require('../../../libs/store')

const {MenuTop, LinkElement} = require('../../components/MenuTop')
const {Input} = require('../../components/Input')
const {Btn} = require('../../components/Btn')
const {ContainerBlockElements} = require('../../components/ContainerBlockElements')
const {BodyContainer} = require('../../components/BodyContainer')

const BrandContainer = styled.div`
  width: 317px;
  margin: auto;
  margin-bottom: 50px;

  > img {
    width: 317px;
  }
`

const BrandContainerLegend = styled.span`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 24px;

  color: #555555;

  display: block;
  text-align: right;
`

const TextInformation = styled.span `
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 16px;
  text-align: justify;

  color: #222222;
`

const TitleDangerDialog = styled.h2 `
  margin: 0px;
  padding: 0px;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  line-height: normal;
  font-size: 24px;
  text-align: center;
  margin-bottom: 10px;

  color: #F37878;
`

const MessageDangerDialog = styled.h2 `
  margin: 0px;
  padding: 0px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 18px;
  text-align: center;

  color: #222222;
`

const Home = ({notFoundCert}) => (
  <BodyContainer>
    <MenuTop>
      <LinkElement stylefloat='right' href="/login">Ingresar</LinkElement>
    </MenuTop>
    <BrandContainer>
      <img src='/OTECNYA.png' alt='Otecnya' />
      <BrandContainerLegend>Certificados</BrandContainerLegend>
    </BrandContainer>

    {
      notFoundCert === true &&
      <ContainerBlockElements marginBottom="30px">
        <TitleDangerDialog>Certificado no encontrado</TitleDangerDialog>
        <MessageDangerDialog>El certificado que intenta válido no se a encontrado, por favor comprueba el número del certificado.</MessageDangerDialog>
      </ContainerBlockElements>
    }

    <form action="/" method="GET">
      <ContainerBlockElements>
          <Input name="code" label="Verifica un certificado aquí" placeholder="1234567"/>
      </ContainerBlockElements>
      <ContainerBlockElements marginTop="30px" align="center">
        <Btn type="submit" text="Verificar"></Btn>
      </ContainerBlockElements>
    </form>
    <ContainerBlockElements marginTop="50px">
      <TextInformation>Todos los títulos y certificados emitidos por Otecnya a partir del x de xxxxx, tiene un código de verificación con el que podrás descargar los documentos solicitados y validar las copias impresas.</TextInformation>
    </ContainerBlockElements>
  </BodyContainer>
)

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
