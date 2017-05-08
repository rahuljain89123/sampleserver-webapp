
import {
  FormGroup,
  FormFeedback,
  Input,
  Label,
} from 'reactstrap'

const SelectFormGroup = (field) => {

  const options = field.options.map((option, i) =>
    (<FormGroup check key={i}>
        <Label check>
          <Input
            {...field.input}
            type='radio'
            value={option.value}
            checked={option.value === field.mValue} />

          {option.title}
        </Label>
    </FormGroup>))

  return (<FormGroup tag='fieldset' color={field.error ? 'danger' : ''}>
    <legend> {field.label} </legend>
    {options}
    <FormFeedback> {field.error} </FormFeedback>
  </FormGroup>)
}

export default SelectFormGroup
