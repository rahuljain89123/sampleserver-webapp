
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
import { fetchTests } from 'actions/tests'
import { setHeaderInfo } from 'actions/global'
import { msgFromError } from 'util'

class SchedulesList extends React.Component {
  componentDidMount () {
    this.props.fetchTests()
    this.props.fetchSchedules({site_id: this.props.site.get('id')})

    this.props.setHeaderInfo(
      'Site setup Schedule List',
      [{
        text: 'New Schedule',
        onClick: `/app/sites/${this.props.site.get('id')}/sampling/sample-schedule/new`,
        iconName: 'add_circle_outline',
      }]
    )
  }

  render () {
    let schedulesTable = undefined
    let schedules = undefined



    schedules = this.props.schedules.valueSeq().sort((a,b) => moment(a.get('date')).isBefore(moment(b.get('date'))) ? -1 : 1).map((schedule) => {
      return (
        <tbody key={schedule.get('id')}>
          <tr>
            <td>
              <Link
                to={`/app/sites/${this.props.site.get('id')}/sampling/sample-schedule/${schedule.get('id')}`}>
                {moment(schedule.get('date')).utc().format('YYYY-MM-DD')}
              </Link>
            </td>
            <td>
              {schedule.get('test_ids').map(testId => (
                <div key={testId}>
                  {this.props.tests.get(testId).get('title')}
                </div>
              ))}
            </td>
            <td>
              <Link
                className="edit-link"
                to={`/app/sites/${this.props.site.get('id')}/sampling/sample-schedule/${schedule.get('id')}`}>
                Edit
              </Link>
            </td>
          </tr>
        </tbody>
      )
    })

    if (this.props.schedules.size > 0 && this.props.site) {
      schedulesTable = (
        <table className="table">
          <thead>
            <tr>
              <th>Schedule Date</th>
              <th>Tests</th>
              <th />
            </tr>
          </thead>
          {schedules}
        </table>
      )
    } else {
      schedulesTable = 'No schedules created yet.'
    }

    return (
      <div className="sample-schedule">
        {schedulesTable}
      </div>
    )
  }
}

const mapStateToProps = (store, ownProps) => ({
  tests: store.get('tests'),
  schedules: store.get('schedules').filter(schedule => schedule.get('site_id') === ownProps.site.get('id')),
})

const mapDispatchToProps = dispatch => ({
  fetchTests: filters => dispatch(fetchTests(filters)),
  fetchSchedules: filters => dispatch(fetchSchedules(filters)),
  setHeaderInfo: (text, buttons) => dispatch(setHeaderInfo(text, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SchedulesList)
