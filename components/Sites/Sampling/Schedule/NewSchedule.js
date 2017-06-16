
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import {
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Col,
} from 'reactstrap'
import {
  createSchedule,
  clearCreatingScheduleError,
  fetchSchedules,
} from 'actions/schedule'
import FormButton from 'SharedComponents/ReduxFormHelpers/FormButton'

import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';

import { setHeaderInfo } from 'actions/global'
import { msgFromError } from 'util'


class NewSchedule extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      date: moment(),
      copy_params: undefined,
    }
    this.changeDate = this.changeDate.bind(this)
  }

  componentDidMount () {
    if (this.props.creatingScheduleError) {
      this.props.clearCreatingScheduleError()
    }
    this.props.fetchSchedules({site_id: this.props.site.get('id')})
    this.props.setHeaderInfo('Sample Schedule')
  }

  onChange (e) {
    if (this.props.creatingScheduleError) {
      this.props.clearCreatingScheduleError()
    }

    this.setState({
      copy_params: e.value,
    })
  }

  changeDate(date) {
    this.setState({
    date: date
    })
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.createSchedule({
      site_id: this.props.site.get('id'),
      date: this.state.date.format('YYYY-MM-DD'),
      copy_params: this.state.copy_params,
    })
    .then(schedule => {
      this.props.push(`/app/sites/${this.props.site.get('id')}/sampling/sample-schedule/${schedule.id}`)
    })
  }


  render () {
    const error = this.props.creatingScheduleError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
      [error.key]: msgFromError(error),
    } : {}

    let scheduleOptions = undefined
    if (this.props.schedules.size > 0) {
      scheduleOptions = this.props.schedules.valueSeq().map(schedule =>
        ({
          value: moment(schedule.get('date')).utc().format('YYYY-MM-DD'),
          label: moment(schedule.get('date')).utc().format('YYYY-MM-DD'),
        }
      )).toJS()
    }

    return (
      <div className="sample-schedule">
        <Form onSubmit={e => this.onSubmit(e)}>
          <FormGroup row color={errors.date ? 'danger' : ''}>
            <Label sm={2} for="date">Date</Label>
            <Col sm={9}>
              <DatePicker
                dateFormat="YYYY-MM-DD"
                state={errors.date ? 'danger' : ''}
                name="date"
                id="date"
                selected={this.state.date}
                onChange={this.changeDate}
                className="form-control"
              />
            </Col>
            <FormFeedback>{errors.date}</FormFeedback>
          </FormGroup>
          {scheduleOptions ? (
            <FormGroup row color={errors.copy_params ? 'danger' : ''}>
              <Label sm={2} for="copy_params">Copy Params from Previous Schedule?</Label>
              <Col sm={9}>
                <Select
                  state={errors.copy_params ? 'danger' : ''}
                  name="copy_params"
                  id="copy_params"
                  value={this.state.copy_params}
                  options={scheduleOptions}
                  placeholder="Select a date..."
                  onChange={e => this.onChange(e)}
                />

              </Col>
              <FormFeedback>{errors.copy_params}</FormFeedback>
            </FormGroup>
          ) : null}
          <FormButton
            color="primary"
            disabled={this.props.creatingSchedule}
          >Create Sample Schedule</FormButton>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  schedules: store.get('schedules'),
  creatingScheduleError: store.get('creatingScheduleError'),
  creatingSchedule: store.get('creatingSchedule'),
})

const mapDispatchToProps = dispatch => ({
  createSchedule: schedule => dispatch(createSchedule(schedule)),
  clearCreatingScheduleError: () => dispatch(clearCreatingScheduleError()),
  fetchSchedules: filters => dispatch(fetchSchedules(filters)),
  setHeaderInfo: (text, buttons) => dispatch(setHeaderInfo(text, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewSchedule)
