import { Input } from 'reactstrap'

const IndividualSelect = (field) => {
  // debugger
  if (field.mValue) { field.input.value = field.mValue }
  return <Input
    { ...field.input}
    type='select'
    state={field.state}
    id={field.id}>
    {field.options}
  </Input>
}

export default IndividualSelect
