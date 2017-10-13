const React = require('react')
const router = require('express').Router()
const {default: styled} = require('styled-components')
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

const Home = () => (
  <BodyContainer>
    <MenuTop>
      <LinkElement stylefloat='right' href="/login">Ingresar</LinkElement>
    </MenuTop>
    <BrandContainer>
      <img src='/OTECNYA.png' alt='Otecnya' />
      <BrandContainerLegend>Certificados</BrandContainerLegend>
    </BrandContainer>
    <ContainerBlockElements>
      <Input label="Verifica un certificado aquí" placeholder="1234567"/>
    </ContainerBlockElements>
    <ContainerBlockElements marginTop="30px" align="center">
      <Btn text="Verificar"></Btn>
    </ContainerBlockElements>
    <ContainerBlockElements marginTop="50px">
      <TextInformation>Todos los títulos y certificados emitidos por Otecnya a partir del x de xxxxx, tiene un código de verificación con el que podrás descargar los documentos solicitados y validar las copias impresas.</TextInformation>
    </ContainerBlockElements>
  </BodyContainer>
)

router.get('/', (req, res, next) => {
  res.renderReact(<Home />)
})

module.exports = router
