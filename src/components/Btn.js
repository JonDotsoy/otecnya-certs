const React = require('react')
const {default: styled, css} = require('styled-components')

const BtnStyledLinkBlock = css `
  background-color: transparent;
  color: #222;
  display: block;
  padding: 10px 10px;
  width: 100%;

  &:hover, &:focus {
    box-shadow: none;
    text-decoration: underline;
  }
`

const BtnElement = styled.button `
  display: inline-block;
  margin-bottom: 10px;

  box-sizing: border-box;
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
  ${({priority}) => (priority === 'link-block' && BtnStyledLinkBlock)}
`

const BtnElementLink = BtnElement.withComponent('a')

module.exports.Btn = (opts) => {
  const {text, type, priority, style, href, ...more} = opts

  const ClassBtn = href ? BtnElementLink : BtnElement

  return (
    <ClassBtn href={href} style={style} priority={priority} type={type} {...more}>{text}</ClassBtn>
  )
}
