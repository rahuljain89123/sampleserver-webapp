
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
} from 'reactstrap'
import {
    createSchedule,
    clearCreatingScheduleError,
    fetchSchedules,
} from 'actions/schedule'
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

    componentWillMount () {
        if (this.props.creatingScheduleError) {
            this.props.clearCreatingScheduleError()
        }
        this.props.fetchSchedules({site_id: this.props.site.get('id')})
    }

    onChange (e) {
        if (this.props.creatingScheduleError) {
            this.props.clearCreatingScheduleError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    changeDate(date) {
      console.log
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
            this.props.push(`/app/sites/${this.props.site.get('id')}/details/sample-schedule/${schedule.id}`)
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
          scheduleOptions = this.props.schedules.map(function (schedule) {
            return <option>{moment(schedule.get('date')).utc().format('YYYY-MM-DD')}</option>
          })
        }

        return (
            <div className="sample-schedule">
                <h2>Sample Schedule</h2>
                <Form onSubmit={e => this.onSubmit(e)}>
                    <FormGroup color={errors.date ? 'danger' : ''}>
                        <Label for="date">Date</Label>
                        <DatePicker
                          dateFormat="YYYY-MM-DD"
                          state={errors.date ? 'danger' : ''}
                          name="date"
                          id="date"
                          selected={this.state.date}
                          onChange={this.changeDate}
                          className="form-control"
                        />
                        <FormFeedback>{errors.date}</FormFeedback>
                    </FormGroup>
                    <FormGroup color={errors.copy_params ? 'danger' : ''}>
                        <Label for="copy_params">Copy Params from Previous Schedule?</Label>
                        <Input
                            state={errors.copy_params ? 'danger' : ''}
                            type="select"
                            name="copy_params"
                            id="copy_params"
                            value={this.state.copy_params}
                            onChange={e => this.onChange(e)}
                        >
                          {scheduleOptions ? (<option selected="selected">Select a date...</option> ) : ( <option></option>)}
                          {scheduleOptions}
                        </Input>
                        <FormFeedback>{errors.copy_params}</FormFeedback>
                    </FormGroup>
                    <Button
                        color="primary"
                        disabled={this.props.creatingSchedule}
                    >Create Sample Schedule</Button>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(NewSchedule)
