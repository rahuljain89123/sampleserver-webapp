
import {
  FormGroup,
  FormFeedback,
  Input,
  Label,
  Row,
  Col,
} from 'reactstrap'

const SelectFormGroup = (field) => (
  <FormGroup row color={field.error ? 'danger' : ''}>
    {field.label && <Label sm={2} for={field.id}>{field.label}</Label>}
    <Col sm={9}>
      <Input
        { ...field.input}
        type='select'
        state={field.state}
        id={field.id}>
        {field.placeholder && <option value=''>{field.placeholder}</option>}
        {field.options}
      </Input>
    </Col>
    <FormFeedback> {field.error} </FormFeedback>
  </FormGroup>
)

export default SelectFormGroup
