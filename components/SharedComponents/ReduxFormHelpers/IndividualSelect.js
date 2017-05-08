import { Input } from 'reactstrap'

const IndividualSelect = (field) => (
  <Input
    { ...field.input}
    type='select'
    state={field.state}
    id={field.id}>
    {field.options}
  </Input>
)

export default IndividualSelect
