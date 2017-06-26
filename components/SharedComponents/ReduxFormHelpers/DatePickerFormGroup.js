
import React from 'react'
import {
  FormGroup,
  Label,
  Col,
} from 'reactstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'

class DatePickerFormGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: this.props.input.value ? moment(this.props.input.value) : ''
    }
  }

  componentDidMount () {
    if (this.state.value) {
      this.props.input.onChange(this.state.value.format('YYYY-MM-DD hh:mm:ss'))
    }
  }

  handleChange (value) {
    this.setState({ value })
    this.props.input.onChange(value.format('YYYY-MM-DD hh:mm:ss'))
  }

  render () {
    const {  state: { value }, handleChange } = this
    const { name, id, label, error } = this.props

    return (
      <FormGroup row>
        <Label sm={2} for={id}> {label} </Label>
        <Col sm={9}>
          <DatePicker
            dateFormat="YYYY-MM-DD"
            state={error ? 'danger' : ''}
            name={name}
            id={id}
            selected={value}
            onChange={handleChange.bind(this)}
            className="form-control"
          />
        </Col>
      </FormGroup>
    )
  }
}

export default DatePickerFormGroup
