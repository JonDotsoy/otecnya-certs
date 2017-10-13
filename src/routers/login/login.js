const router = require('express').Router()

require('../../../libs/express-allow-async')(router)

const toLower = require('lodash/toLower')
const store = require('../../../libs/store')
const React = require('react')
const bodyParser = require('body-parser')
const get = require('lodash/get')
const {default: styled} = require('styled-components')
const {MenuTop, LinkElement} = require('../../components/MenuTop')
const {ContainerBlockElements} = require('../../components/ContainerBlockElements')
const {BodyContainer} = require('../../components/BodyContainer')
const {Input} = require('../../components/Input')
const {Btn} = require('../../components/Btn')

const ErrorLoginContent = styled.div `
  
`

const ErrorLoginTitle = styled.h3 `
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  line-height: normal;
  font-size: 24px;
  text-align: center;
  margin: 0px;
  margin: 0px 0px 10px 0px;

  color: #F37878;
`

const ErrorLoginDialog = styled.h3 `
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 18px;
  text-align: center;
  margin: 0px 0px 30px 0px;

  color: #222222;
`

const Login = ({correctChecked, username}) => {
  return (
    <BodyContainer>
      <MenuTop>
        <LinkElement href="/">Volver</LinkElement>
      </MenuTop>

      {correctChecked === false && (
        <ContainerBlockElements>
          <ErrorLoginContent>
            <ErrorLoginTitle>Error de autenticación</ErrorLoginTitle>
            <ErrorLoginDialog>El nombre de usuario o la contraseña son incorrectos.</ErrorLoginDialog>
          </ErrorLoginContent>
        </ContainerBlockElements>
      )}

      <form action="/login" method="POST">
        <ContainerBlockElements>
          <Input name="username" defaultValue={username} label='Usuario' placeholder="juan" style={{textTransform:'lowercase'}}/>
        </ContainerBlockElements>
        <ContainerBlockElements marginTop='20px'>
          <Input name="password" label='Contraseña' type='password' placeholder="******"/>
        </ContainerBlockElements>
        <ContainerBlockElements marginTop='30px' align='center'>
          <Btn type="submit" text='Ingresar' />
        </ContainerBlockElements>
      </form>
    </BodyContainer>
  )
}

router.use('/login', (req, res, next) => {
  if (get(req, ['session', 'auth', 'ok'], false) === true) {
    return res.redirect('/templates')
  }

  next()
})

router.get('/logout', (req, res) => {
  req.session.auth = undefined
  res.redirect('/')
})

router.get('/login', (req, res) => {
  res.renderReact(<Login />)
})

router.post('/login', bodyParser.urlencoded({ extended: false }))
router.postAsync('/login', async (req, res) => {
  const username = toLower(req.body.username)
  const password = req.body.password

  const checked = await store.checkLogin({username, password})

  if (checked.ok === true) {
    req.session.auth = checked

    return res.redirect('/templates', 302)
  }

  res.renderReact(<Login username={username} correctChecked={checked.ok}/>)
})

module.exports = router
