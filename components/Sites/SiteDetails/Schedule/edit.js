
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
    fetchSchedule,
    clearCreatingScheduleError,
} from '../../../../actions/schedule'
import { msgFromError } from '../../../../util'
import { fetchWells } from '../../../../actions/wells'
import { fetchTests } from '../../../../actions/tests'


class SubstanceRow extends React.Component {
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
        }
    }

    componentWillMount () {
        this.props.fetchTests()
        this.props.fetchWells({ site_id: this.props.site.get('id') })
        this.props.fetchSchedule(this.state.scheduleId)
    }

    componentDidMount () {
        // this.props.fetchSchedule(this.state.scheduleId)
    }

    onChange (e) {
    }


    onSubmit (e) {
    }


    render () {
        let wells = undefined

        if (this.props.wells.size > 0 && this.props.site && this.props.schedule) {
            return <table className="table">
                <thead>
                    <td>Uncheck All</td>
                    <td>Gauge Only - Do Not Sample</td>
                    {this.props.schedule.get('test_ids').map((test_id) => {
                        return <td>{this.props.tests.get(test_id).get('title')}</td>
                    })}
                </thead>
                {wells = this.props.wells.map((well) => {
                  return <tr>
                    <td>{well.get('title')}</td>
                    <td><input type="checkbox"/></td>
                  </tr>
                })}
            </table>
        }

        return (
            <div className="sample-schedule">
                <h2>Site Details Edit Schedule</h2>
                <p>Schedule here</p>
                {wells}
            </div>
        )
    }
}

const mapStateToProps = store => ({
    wells: store.get('wells'),
    tests: store.get('tests'),
    schedule: store.get('schedule'),
})

const mapDispatchToProps = dispatch => ({
    fetchWells: filters => dispatch(fetchWells(filters)),
    fetchTests: filters => dispatch(fetchTests(filters)),
    fetchSchedule: filters => dispatch(fetchSchedule(filters)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSchedule)
