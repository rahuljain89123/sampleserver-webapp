
import {
  FormGroup,
  FormFeedback,
  Input,
  Label,
} from 'reactstrap'

const CheckboxFormGroup = (field) => (
  <div
    className='checkbox form-group'>
    <Label for={field.id} className='form-check-label'>
      <Input
        { ...field.input}
        type={field.type}
        state={field.state}
        id={field.id}
        className='form-check-input'
      />
      {field.label}
    </Label>
    <FormFeedback> {field.error} </FormFeedback>
  </div>
)

export default CheckboxFormGroup
