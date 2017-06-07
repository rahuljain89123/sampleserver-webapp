import {
  Input,
  Label,
} from 'reactstrap'

const SelectSubstances = ({ fields, options, substances }) => {

  const addSubstance = (e) => {
    fields.push(e.target.value)
  }

  return (
    <ul style={{listStyle: 'none', marginBottom: '28px'}} className="list-group"  >
      {fields.map(
        (substance, index, fields) => {
          const remove = (e) => {
            e.preventDefault()
            fields.remove(index)
          }
          return (<li key={index} className="list-group-item">
            {substances.get(parseInt(fields.get(index))).get('title')}{' '}
            <a href='#' onClick={remove}>X</a>
          </li>)
        }
      )}
      <li className={fields.length ? 'mt-2' : ''}>
        <Input type='select' style={{width: '100%'}} onChange={addSubstance}>
          <option value=''> Select Substances </option>
          {options}
        </Input>
      </li>

    </ul>
  )
}

export default SelectSubstances
