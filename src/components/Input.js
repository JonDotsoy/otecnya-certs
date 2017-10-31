const React = require('react')
const uniqueId = require('lodash/uniqueId')
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

const InputFormCheckboxLabel = styled.label `
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 24px;

  color: #222222;

  margin-bottom: 20px;
  padding-left: 20px;
`

const InputFormCheckboxContainer = styled.div `

`

const InputFormCheckbox = styled.input `

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
  const {label, list} = opts
  const nameList = `list-${opts.name || uniqueId()}`

  return (
    <InputContainer>
      <InputLabel>{label}</InputLabel>
      {
        (opts.type === 'checkbox') ? (
          Array.isArray(list) &&
          list.map(element => (
            <InputFormCheckboxContainer key={element}>
              <InputFormCheckbox {...opts} id={`${opts.name}-${element}`} value={element} checked={ [].concat( opts.defaultValue ).indexOf(element) !== -1 }/>
              <InputFormCheckboxLabel htmlFor={`${opts.name}-${element}`}>{element}</InputFormCheckboxLabel>
            </InputFormCheckboxContainer>
          ))
        ) : (
          [
            <InputFormInput {...opts} list={nameList}></InputFormInput>,
            Array.isArray(list) &&
            <datalist id={nameList}>
              {
                list.map(element => (
                  <option key={element} value={element}>{element[Symbol.for('typeShow')]}</option>
                ))
              }
            </datalist>
          ]
        )
      }
    </InputContainer>
  )
}
