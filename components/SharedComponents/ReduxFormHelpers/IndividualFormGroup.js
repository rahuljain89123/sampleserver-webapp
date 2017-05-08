
import {
  FormGroup,
  FormFeedback,
  Input,
  Label,
} from 'reactstrap'

const IndividualFormGroup = (field) => (
  <FormGroup color={field.error ? 'danger' : ''}>
    { field.type !== 'checkbox' && <Label for={field.id}> {field.label} </Label> }
    <Input
      { ...field.input}
      type={field.type}
      state={field.state}
      id={field.id} />
    { field.type === 'checkbox' && <Label for={field.id}> {field.label} </Label> }
    <FormFeedback> {field.error} </FormFeedback>
  </FormGroup>
)

export default IndividualFormGroup
