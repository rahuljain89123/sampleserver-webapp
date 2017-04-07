
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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
} from '../../actions/schedule'
import { msgFromError } from '../../util'


class SiteDetailsSchedule extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            date: '',
            copy_params: '',
        }
    }

    componentWillMount () {
        if (this.props.creatingScheduleError) {
            this.props.clearCreatingScheduleError()
        }
    }

    componentDidMount () {
    }

    onChange (e) {
        if (this.props.creatingScheduleError) {
            this.props.clearCreatingScheduleError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }


    onSubmit (e) {
        e.preventDefault()
        this.props.createSchedule({
            site_id: this.props.site.get('id'),
            date: this.state.date,
            copy_params: this.state.copy_params,
        })
        .then(this.props.onSuccess)
    }


    render () {
        const error = this.props.creatingScheduleError
        const generalError = error && error.msg ? error.msg : null
        const errors = error && error.key ? {
            [error.key]: msgFromError(error),
        } : {}

        return (
            <div className="sample-schedule">
                <h2>Sample Schedule</h2>
                <Form onSubmit={e => this.onSubmit(e)}>
                    <FormGroup color={errors.date ? 'danger' : ''}>
                        <Label for="date">Date</Label>
                        <Input
                            state={errors.date ? 'danger' : ''}
                            name="date"
                            id="date"
                            value={this.state.date}
                            onChange={e => this.onChange(e)}
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
                            <option>Choose a schedule...</option>
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
    creatingScheduleError: store.get('creatingScheduleError'),
    creatingSchedule: store.get('creatingSchedule'),
})

const mapDispatchToProps = dispatch => ({
    createSchedule: schedule => dispatch(createSchedule(schedule)),
    clearCreatingScheduleError: () => dispatch(clearCreatingScheduleError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteDetailsSchedule)
