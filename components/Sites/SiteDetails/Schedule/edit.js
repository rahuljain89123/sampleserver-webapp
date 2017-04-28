
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
} from '../../../../actions/schedule'
import { msgFromError } from '../../../../util'
import { fetchWells } from '../../../../actions/wells'
import { fetchTests } from '../../../../actions/tests'


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

    componentWillMount () {
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
    }

    onChange (e) {
        console.log(e.target.value)
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
        console.log(test_id)

        this.props.editSchedule(this.state.scheduleId, {
            tests: {
                add: [],
                remove: [test_id],
            },
        })
    }

    render () {
        if (this.props.wells && this.props.site && this.props.schedules.size > 0 && this.props.tests.size > 0) {
            const schedule = this.props.schedules.get(this.state.scheduleId)

            return <div className="sample-schedule">
                <h2>Edit Schedule</h2>

                <select name="tests" onChange={(e) => this.onChange(e)}>
                {this.props.tests.map((test) => {
                    return <option key={test.get('id')} value={test.get('id')}>{test.get('title')}</option>
                })}
                </select>

                <button className="btn btn-primary" onClick={(e) => this.addTest(e)}>Add Test</button>
                <table className="table table-striped">
                    <thead>
                        <td>&nbsp;</td>
                        <td>Uncheck All</td>
                        <td>Gauge Only - Do Not Sample</td>
                        {schedule.get('test_ids').map((test_id) => {
                            return <td key={test_id}>
                                {this.props.tests.get(test_id).get('title')}
                                <i
                                    className="fa fa-times pointer"
                                    onClick={(e) => this.deleteTest(e, test_id)}
                                />
                            </td>
                        })}
                    </thead>
                    <tbody>
                        {this.props.wells.map((well) => {
                          return <tr key={well.get('id')}>
                            <td>{well.get('title')}</td>
                            <td><input type="checkbox"/></td>
                            <td><input type="checkbox"/></td>
                            {schedule.get('test_ids').map((test_id) => {
                                return <td key={test_id}><input type="checkbox"/></td>
                            })}
                          </tr>
                        })}
                    </tbody>
                </table>
            </div>
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
})

const mapDispatchToProps = dispatch => ({
    fetchWells: filters => dispatch(fetchWells(filters)),
    fetchTests: filters => dispatch(fetchTests(filters)),
    fetchSchedule: filters => dispatch(fetchSchedule(filters)),
    editSchedule: (id, schedule) => dispatch(editSchedule(id, schedule)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSchedule)
