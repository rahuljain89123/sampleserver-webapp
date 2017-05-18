import {
  Input,
  Label,
} from 'reactstrap'

const SelectSubstances = ({ fields, options, substances }) => {

  const addSubstance = (e) => {
    fields.push(e.target.value)
  }

  return (
    <ul style={{listStyle: 'none'}}>
      <li> <Label>Substances</Label></li>
      {fields.map(
        (substance, index, fields) => {
          const remove = (e) => {
            e.preventDefault()
            fields.remove(index)
          }
          return (<li key={index}>
            {substances.get(parseInt(fields.get(index))).get('title')}{' '}
            <a href='#' onClick={remove}>X</a>
          </li>)
        }
      )}
      <li>
        <Input type='select' style={{width: '100%'}} onChange={addSubstance}>
          <option value=''> Add a Substance </option>
          {options}
        </Input>
      </li>
    </ul>
  )
}

export default SelectSubstances
