import {
  Input,
  Label,
} from 'reactstrap'
import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';

const SelectSubstances = ({ fields, options, substances }) => {

  const addSubstance = (e) => {
    fields.push(e.value)
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
            <span>{substances.get(parseInt(fields.get(index))).get('title')}{' '}</span>
            <a href='#' onClick={remove}>X</a>
          </li>)
        }
      )}
      <li className={fields.length ? 'mt-2' : ''}>
        <Select type='select' style={{width: '100%'}} onChange={addSubstance} options={options} />

      </li>

    </ul>
  )
}

export default SelectSubstances
