import {
  FormGroup,
  FormFeedback,
  Input,
  Label,
} from 'reactstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'

class DatePickerFormGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: moment(this.props.input.value)
    }
  }

  handleChange (value) {
    this.setState({ value })
    this.props.input.onChange(value.format('YYYY-MM-DD hh:mm:ss'))
  }

  render () {
    const {  state: { value }, handleChange } = this
    const { id, label, error } = this.props

    return (<FormGroup>
      <Label for={id}> {label} </Label>
      <DatePicker
        dateFormat="YYYY-MM-DD"
        state={error ? 'danger' : ''}
        name="date"
        id="date"
        selected={value}
        onChange={handleChange.bind(this)}
        className="form-control"
      />
    </FormGroup>)
  }
}

export default DatePickerFormGroup
