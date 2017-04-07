
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
    createSampleSchedule,
    clearCreatingSampleScheduleError,
} from '../../actions/sample-schedule'
import { msgFromError } from '../../util'


class SiteDetailsSampleSchedule extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            date: '',
            copy_params: '',
        }
    }

    componentDidMount () {
    }

    onChange (e) {
        if (this.props.creatingSampleScheduleError) {
            this.props.clearCreatingSampleScheduleError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }


    onSubmit (e) {
        e.preventDefault()
        this.props.createSampleSchedule({
            site_id: this.props.site.get('id'),
            date: this.state.date,
            copy_params: this.state.copy_params,
        })
        .then(this.props.onSuccess)
    }


    render () {
        const error = this.props.editingSiteError
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
                        disabled={this.props.creatingSampleSchedule}
                    >Create Sample Schedule</Button>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    creatingSampleScheduleError: store.get('creatingSampleScheduleError'),
    creatingSampleSchedule: store.get('creatingSampleSchedule'),
})

const mapDispatchToProps = dispatch => ({
    createSampleSchedule: sampleSchedule => dispatch(createSampleSchedule(sampleSchedule)),
    clearCreatingSampleScheduleError: () => dispatch(clearCreatingSampleScheduleError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteDetailsSampleSchedule)
