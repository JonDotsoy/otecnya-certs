const React = require('react')
const RUT = require('rut.js')
const {default: styled} = require('styled-components')

const moment = require('moment-timezone')
const {MenuTop, LinkElement} = require('../../components/MenuTop')
const {ContainerBlockElements} = require('../../components/ContainerBlockElements')
const {BodyContainer} = require('../../components/BodyContainer')
const {Input} = require('../../components/Input')
const {Btn} = require('../../components/Btn')

const loadIconSearch = ({fill = '#000000'}) => `
<svg fill="${fill}" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
</svg>
`

const Title = styled.h1`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 24px;
  padding-bottom: 20px;

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

  ${({empty}) => empty && `color:#aaaaaa;` }
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

const InputSearchContent = styled.div `
  position: relative;
  margin-bottom: 20px;
`

const InputSearchBtn = styled.button `
  position: absolute;
  color: #AAAAAA;
  background-image: url('data:image/svg+xml;utf8,${loadIconSearch({fill: '#AAAAAA'})}');
  background-size: 100% 100%;
  background-position: center;
  top: 15px;
  right: 20px;
  width: 24px;
  height: 24px;
  border: none;
  background-color: transparent;
`

const InputSearch = ({defaultValue, autocomplete, listName}) => (
  <InputSearchContent>
    <form action="/certs" method="GET">
      <Input list={autocomplete} name="filter" placeholder="Search..." defaultValue={defaultValue}/>
      {/* <datalist id={listName}>
        {
          autocomplete.map((value) => (
            <option key={value} value={value}></option>
          ))
        }
      </datalist> */}
      <InputSearchBtn />
    </form>
  </InputSearchContent>
)


const FieldDataContainer = ({title, value}) => (
  <ContainerBlockElements>
    <FieldDataTitle>{title}</FieldDataTitle>
    {
      value
        ? <FieldDataValue>{value}</FieldDataValue>
        : <FieldDataValue empty>[Sin definir]</FieldDataValue>
    }
  </ContainerBlockElements>
)

const CertView = module.exports.CertView = ({cert, cloneLink, deleteLink, rawLink, authenticatedMode}) => {
  return (
    <BodyContainer>

      {
        authenticatedMode === true &&
        <MenuTop>
          <LinkElement href="/certs">Certificados</LinkElement>
          <LinkElement href="/logout" stylefloat='right'>Salir</LinkElement>
        </MenuTop>
      }

      {
        authenticatedMode === false &&
        <MenuTop>
          <LinkElement href="/logout" stylefloat='right'>Salir</LinkElement>
        </MenuTop>
      }

      <ContainerBlockElements>
        <Title title={`Certificado ${cert._template.title}`}>{cert._template.title}</Title>
      </ContainerBlockElements>

      {
        cert._template.fields.map((field) => {
          const {name, title} = field
          const valueBrute = cert.data[name]
          let value = (typeof field.format === 'function') ? field.format(valueBrute) : valueBrute

          if (field.type === 'date') {
            value = moment(valueBrute).format('LL')
          }

          return (
            <FieldDataContainer
              key={name}
              name={name}
              title={`${title}`}
              value={value}
            />
          )
        })
      }

      <ContainerBlockElements>
        <Btn text='Descargar' target="_blank" style={{'marginRight': '10px'}} href={rawLink}/>
        {
          authenticatedMode === true &&
          <Btn href={deleteLink} text='Eliminar' priority='danger' />
        }
        {
          authenticatedMode === true &&
          <Btn href={cloneLink} text="Create uno similar"></Btn>
        }
      </ContainerBlockElements>

    </BodyContainer>
  )
}

const CertsView = module.exports.CertsView = ({certs, defaultValueSearch, autocompleteSearch, authenticatedMode}) => (
  <BodyContainer>
      <MenuTop>
        <LinkElement href="/templates">Plantillas</LinkElement>
        <LinkElement href="/logout" stylefloat='right'>Salir</LinkElement>
      </MenuTop>

      <ContainerBlockElements>
        <InputSearch autocomplete={[...autocompleteSearch]} listName='searchList' defaultValue={defaultValueSearch} />
      </ContainerBlockElements>

      <ContainerBlockElements>
        {
          certs.map(cert => (
            <CertCardView
              href={`/certs/${cert.code}`}
              key={cert.code}
              fullName={cert.fullName}
              business={cert.data.business}
              code={cert.code}
              templateName={cert._template.title}
            />
          ))
        }
      </ContainerBlockElements>

  </BodyContainer>
)

const CertCardView = ({href, fullName, templateName, code, business}) => (
  <CertCardContainer href={href}>
    <hgroup>
      <NameCert>{templateName}{business && <spam> ({business})</spam>}</NameCert>
      <TitleCert>{fullName}</TitleCert>
      <CodeCert>{code}</CodeCert>
    </hgroup>
  </CertCardContainer>
)

const TitleCert = styled.h3 `
  margin: 0px;
  padding: 0px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 20px;
  text-transform: uppercase;

  color: #222222;
`

const NameCert = styled.h4 `
  margin: 0px;
  padding: 0px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 18px;

  color: #555555;
`

const CodeCert = styled.h3 `
  margin: 0px;
  padding: 0px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 20px;

  color: #777777;
`

const CertCardContainer = styled.a `
  display: block;
  border-bottom: solid 1px #CCCCCC;
  margin-bottom: 10px;
  padding: 4px 0px;
  text-decoration: none;
`

const DeleteTitle = styled.h1 `
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  line-height: normal;
  font-size: 24px;
  text-align: center;

  color: #F37878;
`

const DeleteCertView = module.exports.DeleteCertView = ({cert, certLink, submitDeleteLink}) => (
  <BodyContainer>
    <MenuTop>
      <LinkElement href="/templates">Plantillas</LinkElement>
      <LinkElement href="/logout" stylefloat='right'>Salir</LinkElement>
    </MenuTop>

    <ContainerBlockElements marginTop="30px">
      <DeleteTitle>¿Realmente quiere eliminar este certificado?</DeleteTitle>
    </ContainerBlockElements>

    <ContainerBlockElements  marginTop="10px">
      <CertCardView
        key={cert.code}
        fullName={cert.fullName}
        code={cert.code}
        templateName={cert._template.title}
      />
    </ContainerBlockElements>

    <ContainerBlockElements marginTop="30px">
      <form action={submitDeleteLink} method="POST" style={{'display': 'inline'}}>
        <Btn type="submit" text='Confirmar' style={{'marginRight': '10px'}} priority='danger'/>
      </form>
      <Btn text='Cancelar' href={certLink}></Btn>
    </ContainerBlockElements>

  </BodyContainer>
)
