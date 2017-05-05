
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
  editSchedule,
  fetchSchedule,
  clearCreatingScheduleError,
} from 'actions/schedule'
import { fetchWells } from 'actions/wells'
import { fetchTests } from 'actions/tests'

import { msgFromError } from 'util'

import {
    fetchScheduleWellTests,
    createScheduleWellTest,
    editScheduleWellTest,
    deleteScheduleWellTest,
} from 'actions/scheduleWellTests'
import includes from 'lodash/includes'


class WellRow extends React.Component {
  render () {
    return <div>
      {this.props.well.get('title')}
      <input type="checkbox" />
      <input type="checkbox" />
      <input type="checkbox" />
      <input type="checkbox" />
    </div>
  }
}

class EditSchedule extends React.Component {
  constructor (props) {
    super(props)

    const scheduleId = parseInt(props.match.params.id, 10)
    this.state = {
      scheduleId,
      test: 0,
    }
  }

  componentDidMount () {
    this.props.fetchTests().then((tests) => {
      console.log(this.props.tests)
    })
    this.props.fetchWells({ site_id: this.props.site.get('id') }).then((wells) => {
      console.log(this.props.wells)
    })
    this.props.fetchSchedule(this.state.scheduleId).then((schedule) => {
      console.log(this.props.schedules)
    })
    this.props.fetchScheduleWellTests({ schedule_id: this.state.scheduleId }).then(() => {
      console.log(this.props.scheduleWellTests.toObject())
    })
  }

  onChange (e) {
    this.setState({
      test: e.target.value,
    })
  }


  addTest (e) {
    this.props.editSchedule(this.state.scheduleId, {
      tests: {
        add: [parseInt(this.state.test)],
        remove: [],
      },
    })
  }

  deleteTest (e, test_id) {
    this.props.editSchedule(this.state.scheduleId, {
      tests: {
        add: [],
        remove: [test_id],
      },
    })
  }

  toggleTest (e, testId, wellId, scheduleId) {
      if (e.target.checked) {
          // Checked, enable the test!
          this.props.createScheduleWellTest({
              test_id: testId,
              well_id: wellId,
              schedule_id: scheduleId,
          })
      } else {
          const mycheck = this.props.scheduleWellTests
              .filter(schedulewelltest => schedulewelltest.get('well_id') === wellId)
              .filter(schedulewelltest => schedulewelltest.get('test_id') === testId)
              .first()
          this.props.deleteScheduleWellTest(mycheck.get('id'))
      }
  }

  toggleGuagedWell (e, wellId) {
      if (e.target.checked) {
          this.props.editSchedule(this.state.scheduleId, {
              gauged_wells: {
                  add: [wellId],
                  remove: [],
              },
          })
      } else {
          this.props.editSchedule(this.state.scheduleId, {
              gauged_wells: {
                  add: [],
                  remove: [wellId],
              },
          })
      }
  }

  isChecked (testId, wellId, scheduleId) {
      if (this.props.scheduleWellTests.size) {
          const mycheck = this.props.scheduleWellTests
              .filter(schedulewelltest => schedulewelltest.get('well_id') === wellId)
              .filter(schedulewelltest => schedulewelltest.get('test_id') === testId)
              .first()
          if (mycheck) {
              return true
          }
      }
      return false
  }

  toGuage (wellId) {
      if (this.props.schedules.size) {
          const schedule = this.props.schedules.get(this.state.scheduleId)
          if (includes(schedule.get('gauged_well_ids'), wellId)) {
              return true
          }
      }
      return false
  }

  render () {
    const { wells, site, schedules } = this.props
    const siteStateId = parseInt(site.get('state_id'))
    const tests = this.props.tests.filter((test) => test.get('state_id') === siteStateId)

    if (wells && site && schedules.size > 0 && tests.size > 0) {
      const schedule = this.props.schedules.get(this.state.scheduleId)

      return (
          <div className="sample-schedule">
            <h2>Edit Schedule</h2>

            <select name="tests" onChange={e => this.onChange(e)}>
              {tests.map(test => (
                <option key={test.get('id')} value={test.get('id')}>{test.get('title')}</option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={e => this.addTest(e)}>Add Test</button>
            <table className="table table-striped">
              <thead>
                <td>&nbsp;</td>
                <td>Gauge Only</td>
                {schedule.get('test_ids').map(testId => (
                  <td key={testId}>
                    {tests.get(testId).get('title')}
                    <i
                      className="fa fa-times pointer"
                      onClick={e => this.deleteTest(e, testId)}
                    />
                  </td>
                ))}
              </thead>
              <tbody>
                {this.props.wells.map(well => (
                    <tr key={well.get('id')}>
                      <td>{well.get('title')}</td>
                      <td>
                        <input
                          type="checkbox"
                          className="gauge-only"
                          onClick={e => this.toggleGuagedWell(e, well.get('id'))}
                          checked={this.toGuage(well.get('id'))}
                        />
                      </td>
                      {schedule.get('test_ids').map(testId => (
                        <td key={testId}>
                          <input
                            type="checkbox"
                            onChange={e => this.toggleTest(e, testId, well.get('id'), schedule.get('id'))}
                            checked={this.isChecked(testId, well.get('id'), schedule.get('id'))}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
            </table>
          </div>
      )
    } else {
      return <div className="sample-schedule">
        <h2>Edit Schedule</h2>
      </div>
    }
  }
}

const mapStateToProps = store => ({
  wells: store.get('wells'),
  tests: store.get('tests'),
  schedules: store.get('schedules'),
  scheduleWellTests: store.get('scheduleWellTests'),
})

const mapDispatchToProps = dispatch => ({
  fetchWells: filters => dispatch(fetchWells(filters)),
  fetchTests: filters => dispatch(fetchTests(filters)),
  fetchSchedule: filters => dispatch(fetchSchedule(filters)),
  editSchedule: (id, schedule) => dispatch(editSchedule(id, schedule)),
  fetchScheduleWellTests: filters => dispatch(fetchScheduleWellTests(filters)),
  createScheduleWellTest: schedulewelltest => dispatch(createScheduleWellTest(schedulewelltest)),
  editScheduleWellTest: (id, schedulewelltest) => dispatch(editScheduleWellTest(id, schedulewelltest)),
  deleteScheduleWellTest: id => dispatch(deleteScheduleWellTest(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSchedule)
