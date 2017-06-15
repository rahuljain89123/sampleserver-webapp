import { Input } from 'reactstrap'

import Select from 'react-select';
import 'react-select/dist/react-select.css';

const IndividualSelect = (field) => {
  if (field.mValue) { field.input.value = field.mValue }
  return <Select
    onChange={(v) => field.input.onChange(v.value)}
    value={field.input.value}
    name={field.input.name}
    id={field.id}
    options={field.options}
    />

}

export default IndividualSelect
