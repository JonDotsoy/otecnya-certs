const React = require('react')
const {default: styled} = require('styled-components')

const LinkElement = module.exports.LinkElement = styled.a `
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 20px;
  text-decoration-line: underline;

  color: #222222;

  ${({stylefloat}) => stylefloat && `float: ${stylefloat};`}
`

const MenuTopContainer = styled.div `
  padding: 20px 30px;
  width: 100%;
  min-height: 74px;
  box-sizing: border-box;
`

module.exports.MenuTop = ({children}) => (
  <MenuTopContainer>
    {children}
  </MenuTopContainer>
)
