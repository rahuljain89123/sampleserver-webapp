
import {
  FormGroup,
  FormFeedback,
  Input,
  Label,
} from 'reactstrap'

const SelectFormGroup = (field) => (
  <FormGroup color={field.error ? 'danger' : ''}>
    <Input
      { ...field.input}
      type='select'
      state={field.state}
      id={field.id}>
      <option value=''>{field.label}</option>
      {field.options}
    </Input>
    <FormFeedback> {field.error} </FormFeedback>
  </FormGroup>
)

export default SelectFormGroup
