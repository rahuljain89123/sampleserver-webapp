
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


class ListSchedules extends React.Component {
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
            <Button onClick={() => this.props.push(`/app/sites/${this.props.site.get('id')}/details/sample-schedule/new`)} className='btn btn-default float-right'>New Schedule</Button>
                <h2>Site Details Schedule List</h2>

            </div>
        )
    }
}

const mapStateToProps = store => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ListSchedules)
