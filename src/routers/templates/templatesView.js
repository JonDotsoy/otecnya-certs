const React = require('react')
const {default: styled} = require('styled-components')

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

const TemplatesView = module.exports.TemplatesView = ({templates}) => {
  return (
    <BodyContainer>
      <MenuTop>
        <LinkElement href="/certs">Certificados</LinkElement>
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

const CreateCertView = module.exports.CreateCertView = ({urlSubmit, fields}) => {
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

