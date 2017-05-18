
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Button,
} from 'reactstrap'

import {
  createSchedule,
  clearCreatingScheduleError,
  fetchSchedules,
} from 'actions/schedule'
import { msgFromError } from 'util'

class SchedulesList extends React.Component {
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
    let schedules = undefined

    if (this.props.schedules.size > 0 && this.props.site) {
      schedules = this.props.schedules.map((schedule) => {
        return <li>
          <Link to={`/app/sites/${this.props.site.get('id')}/details/sample-schedule/${schedule.get('id')}`}> {moment(schedule.get('date')).utc().format('YYYY-MM-DD')} </Link>
        </li>
      })
    } else {
      schedules = <span> No schedules yet. <Link to={`/app/sites/${this.props.site.get('id')}/details/sample-schedule/new`}>Create one</Link> </span>
    }

    return (
      <div className="sample-schedule">
        <div className="d-flex flex-row">
          <h2>Site Details Schedule List</h2>
          <Button
            onClick={() => this.props.push(`/app/sites/${this.props.site.get('id')}/details/sample-schedule/new`)}
            className="ml-auto btn btn-default"
          >New Schedule</Button>
        </div>
        {schedules}
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

export default connect(mapStateToProps, mapDispatchToProps)(SchedulesList)
