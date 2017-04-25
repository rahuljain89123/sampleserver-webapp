
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
    fetchSchedules,
} from '../../../../actions/schedule'
import { msgFromError } from '../../../../util'


class ListSchedules extends React.Component {
    constructor (props) {
        super(props)
    }

    componentWillMount () {
        this.props.fetchSchedules({site_id: this.props.site.get('id')})
    }

    componentDidMount () {
        this.props.fetchSchedules({site_id: this.props.site.get('id')})
        .then(() => {
            this.props.schedules.map(schedule => {
                console.log(schedule.get('date'))
            })
        })

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
                {this.props.schedules.map(schedule => {
                    <Link to={`/app/sites/${this.props.site.get('id')}/details/sample-schedule/${schedule.get('id')}`}>
                        {schedule.get('date')}
                    </Link>
                })}
            </div>
        )
    }
}

const mapStateToProps = store => ({
    schedules: store.get('schedules'),
})

const mapDispatchToProps = dispatch => ({
    fetchSchedules: filters => dispatch(fetchSchedules(filters)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ListSchedules)
