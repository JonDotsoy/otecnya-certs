const React = require('react')
const {default: styled} = require('styled-components')

const BtnElement = styled.button `
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  line-height: normal;
  font-size: 24px;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;

  color: #FFFFFF;

  border: none;
  background-color: #66BB9A;
  border-radius: 4px;
  padding: 15px 40px;

  &:hover, &:focus {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12), 0px 0px 4px rgba(0, 0, 0, 0.24);
  }

  ${({priority}) => (priority === 'danger' && `background-color: #F16A6A;`)}
`

const BtnElementLink = BtnElement.withComponent('a')

module.exports.Btn = (opts) => {
  const {text, type, priority, style, href} = opts

  const ClassBtn = href ? BtnElementLink : BtnElement

  return (
    <ClassBtn href={href} style={style} priority={priority} type={type}>{text}</ClassBtn>
  )
}