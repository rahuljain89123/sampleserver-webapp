import { Input } from 'reactstrap'

export const renderInputField = (field) => {
  return <Input
    { ...field.input}
    type={field.type}
    state={field.state}
    id={field.id} />
}
