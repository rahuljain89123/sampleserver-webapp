import { Input } from 'reactstrap'

import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';

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
