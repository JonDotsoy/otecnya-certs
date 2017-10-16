const React = require('react')
const {default: styled} = require('styled-components')

const InputContainer = styled.div `
  
`

const InputLabel = styled.label `
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 24px;

  color: #222222;

  margin-bottom: 20px;
  display: block;
`

const InputFormInput = styled.input `
  width: 100%;
  background: #FFFFFF;
  border: 2px solid #DDDDDD;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 12px 20px;

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 24px;

  color: #222222;

  &::placeholder {
    color: #AAAAAA;
  }

  &[disabled] {
    background-color: #ddd;
  }
`

module.exports.Input = (opts) => {
  const {label} = opts

  return (
    <InputContainer>
      <InputLabel>{label}</InputLabel>
      <InputFormInput {...opts}></InputFormInput>
    </InputContainer>
  )
}
