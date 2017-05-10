import { Input } from 'reactstrap'

const IndividualInput = (field) => (
  <Input
    { ...field.input}
    type={field.type}
    state={field.state}
    id={field.id} />
)

export default IndividualInput
