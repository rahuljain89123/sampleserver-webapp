
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
} from '../../../../actions/schedule'
import { msgFromError } from '../../../../util'


class EditSchedule extends React.Component {
    constructor (props) {
        super(props)
    }

    componentWillMount () {
    }

    componentDidMount () {
    }

    onChange (e) {
    }


    onSubmit (e) {
    }


    render () {

        return (
            <div className="sample-schedule">
                <h2>Site Details Edit Schedule</h2>
                <p>Schedule here</p>
            </div>
        )
    }
}

const mapStateToProps = store => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSchedule)
