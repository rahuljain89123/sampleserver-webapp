
import {
  FormGroup,
  FormFeedback,
  Input,
  Label,
} from 'reactstrap'

const SelectFormGroup = (field) => (
  <FormGroup color={field.error ? 'danger' : ''}>
    {field.label && <Label for={field.id}>{field.label}</Label>}
    <Input
      { ...field.input}
      type='select'
      state={field.state}
      id={field.id}>
      {field.placeholder && <option value=''>{field.placeholder}</option>}
      {field.options}
    </Input>
    <FormFeedback> {field.error} </FormFeedback>
  </FormGroup>
)

export default SelectFormGroup
