const React = require('react')
const {default: styled} = require('styled-components')

const ContainerBlockElements = styled.div `
  max-width: 480px;
  margin: auto;
  padding: 0px 30px;
  ${({marginTop}) => marginTop && `padding-top: ${marginTop};`}
  ${({align}) => align && `text-align: ${align};`}
`

module.exports.ContainerBlockElements = ContainerBlockElements