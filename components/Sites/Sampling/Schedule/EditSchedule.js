
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
  Row,
  Col,
} from 'reactstrap'
import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';

import SiteActivityReportForm from './SiteActivityReportForm'

import {
  createSchedule,
  editSchedule,
  fetchSchedule,
  clearCreatingScheduleError,
} from 'actions/schedule'
import { fetchWells } from 'actions/wells'
import { fetchTests } from 'actions/tests'
import {
  fetchScheduleWellTests,
  createScheduleWellTest,
  editScheduleWellTest,
  deleteScheduleWellTest,
} from 'actions/scheduleWellTests'
import { flashMessage, setHeaderInfo } from 'actions/global'

import { msgFromError } from 'util'
import includes from 'lodash/includes'
import moment from 'moment'

/*****************************************************************************
 * CLASS DEFINITION
 *****************************************************************************/

class EditSchedule extends React.Component {
  constructor (props) {
    super(props)

    const scheduleId = parseInt(props.match.params.id, 10)
    this.state = {
      scheduleId,
      test: 0,
    }

    this.editSchedule = this.editSchedule.bind(this)
  }

  componentDidMount () {
    this.props.fetchTests()
    this.props.fetchWells({ site_id: this.props.site.get('id') })

    this.props.fetchSchedule(this.state.scheduleId).then((schedule) => {
      const formattedDate = moment(schedule.date).utc().format('YYYY-MM-DD')
      this.props.setHeaderInfo(`Edit Schedule: ${formattedDate}`)
    })
    this.props.fetchScheduleWellTests({ schedule_id: this.state.scheduleId })
    this.props.setHeaderInfo(`Edit Schedule: `)
  }

  onChange (e) {
    this.setState({
      test: e.value,
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

  deleteTest (e, testId) {
    this.props.editSchedule(this.state.scheduleId, {
      tests: {
        add: [],
        remove: [testId],
      },
    })
  }

  /**
   * Toggle the given test for the well.
   */
  toggleTest (e, testId, wellId, scheduleId) {
    if (e.target.checked) {
      // Checked, enable the test!
      this.props.createScheduleWellTest({
        test_id: testId,
        well_id: wellId,
        schedule_id: scheduleId,
      })
      // They want to test a well, lets remove the checkbox from skipped/guaged only
      this.props.editSchedule(this.state.scheduleId, {
        skipped_wells: {
          add: [],
          remove: [wellId],
        },
        gauged_wells: {
          add: [],
          remove: [wellId],
        },
      })
    } else {
      const mycheck = this.props.scheduleWellTests
        .filter(schedulewelltest => schedulewelltest.get('well_id') === wellId)
        .filter(schedulewelltest => schedulewelltest.get('test_id') === testId)
        .first()
      this.props.deleteScheduleWellTest(mycheck.get('id'))
    }
  }

  /**
   * Mark the well as one that should only be gauged
   *  also removes all tests for that particular well.
   */
  toggleGaugedWell (e, wellId) {
    if (e.target.checked) {
      this.props.editSchedule(this.state.scheduleId, {
        gauged_wells: {
          add: [wellId],
          remove: [],
        },
      })
      this.props.editSchedule(this.state.scheduleId, {
        skipped_wells: {
          add: [],
          remove: [wellId],
        },
      })
      this.removeTestsFromWell(wellId)
    } else {
      this.props.editSchedule(this.state.scheduleId, {
        gauged_wells: {
          add: [],
          remove: [wellId],
        },
      })
    }
  }

  /**
   * Mark the selected wellId as a well that should explicitly not be gauged/tested.
   *  also removes all tests for that particular well.
   */
  toggleSkipWell (e, wellId) {
    if (e.target.checked) {
      this.props.editSchedule(this.state.scheduleId, {
        skipped_wells: {
          add: [wellId],
          remove: [],
        },
        gauged_wells: {
          add: [],
          remove: [wellId],
        },
      })
      this.removeTestsFromWell(wellId)
    } else {
      this.props.editSchedule(this.state.scheduleId, {
        skipped_wells: {
          add: [],
          remove: [wellId],
        },
      })
    }
  }

  /**
   * Remove all tests for a well.
   */
  removeTestsFromWell (wellId) {
    // Find all the well tests for a paricular well
    const myWellTests = this.props.scheduleWellTests
      .filter(schedulewelltest => schedulewelltest.get('well_id') === wellId)
    // Delete all tests since they are skipping the well
    myWellTests.forEach(wellTest => {
      this.props.deleteScheduleWellTest(wellTest.get('id'))
    })
  }

  /**
   * @return true if the well is supposed to be gauged
   */
  toGauge (wellId) {
    if (this.props.schedules.size) {
      const schedule = this.props.schedules.get(this.state.scheduleId)
      if (schedule.get('gauged_well_ids').includes(wellId)) {
        return true
      }
    }
    return false
  }

  /**
   * @return true if the well is marked as 'Do not sample or gauge'
   */
  skippedWell (wellId) {
    if (!this.props.schedules.size) { return false }

    const schedule = this.props.schedules.get(this.state.scheduleId)
    return schedule.get('skipped_well_ids').includes(wellId)
  }

  /**
   * @return true if the well is supposed to be tested for the given testId
   */
  isChecked (testId, wellId) {
    if (this.props.scheduleWellTests.size) {
      const mycheck = this.props.scheduleWellTests
        .filter(schedulewelltest =>
          (schedulewelltest.get('well_id') === wellId &&
          schedulewelltest.get('test_id') === testId)
        )
        .first()

      if (mycheck) { return true }
    }
    return false
  }

  editSchedule (scheduleParams) {
    this.props.editSchedule(this.state.scheduleId, scheduleParams)
      .then(() => { this.props.flashMessage('success', 'Site Activity Report Updated') })
      .catch(() => { this.props.flashMessage('danger', 'There was an error') })
  }

  render () {
    const { site, schedules } = this.props
    const siteStateId = parseInt(site.get('state_id'))
    const stateTests = this.props.tests
      .filter((test) => test.get('state_id') === siteStateId)
      .valueSeq()
    const wells = this.props.wells.valueSeq()


    if (wells.size && site && schedules.size > 0 && stateTests.size > 0) {

      const schedule = this.props.schedules.get(this.state.scheduleId)
      const tests = stateTests.filter((test) => !schedule.get('test_ids').includes(test.get('id')))
      const testOptions = tests.map(test => ( { label: test.get('title'), value: test.get('id') })).valueSeq().toJS()
      const formattedDate = moment(schedule.get('date')).utc().format('YYYY-MM-DD')
      const siteActivityReport = schedule.delete('test_ids')
        .delete('gauged_well_ids')
        .set('date', formattedDate)

      return (
        <div className="sample-schedule">
          <div className="row add-test">
            <div className="col-sm-10">
              <Select
                onChange={e => this.onChange(e)}
                className="select-tests"
                value={this.state.test}
                options={testOptions}
              />
            </div>
            <div className="col-sm-2">
              <button className="btn btn-primary btn-block" onClick={e => this.addTest(e)}>Add Test</button>
            </div>
          </div>

          <table className="table table-striped tests table">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Do Not Sample or Gauge</th>
                <th>Gauge Only</th>
                {schedule.get('test_ids').map(testId => (
                  <th key={testId}>
                    {this.props.tests.get(testId).get('title')}
                    <i
                      className="fa fa-times pointer"
                      onClick={e => this.deleteTest(e, testId)}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wells.map(well => (
                <tr key={well.get('id')}>
                  <td className="well-title">{well.get('title')}</td>
                  <td>
                    <input
                      type="checkbox"
                      className="skipped"
                      onChange={e => this.toggleSkipWell(e, well.get('id'))}
                      checked={this.skippedWell(well.get('id'))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      className="gauge-only"
                      onChange={e => this.toggleGaugedWell(e, well.get('id'))}
                      checked={this.toGauge(well.get('id'))}
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
    }
    if (!stateTests.size) {
      return <div className="sample-schedule"><p>No tests found for this state.</p></div>
    }
    if (!wells.size) {
      return <div className="sample-schedule"><p>No wells found for this site.</p></div>
    }
    return (
      <div className="sample-schedule">
        <p>
          No tests found for this state.
        </p>
      </div>
    )
  }
}


/*****************************************************************************
* REDUX MAP TO PROPS
*****************************************************************************/

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
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  setHeaderInfo: (text, buttons) => dispatch(setHeaderInfo(text,buttons)),
})

/*****************************************************************************
 * EXPORT
 *****************************************************************************/

export default connect(mapStateToProps, mapDispatchToProps)(EditSchedule)
