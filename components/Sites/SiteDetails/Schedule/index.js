
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, NavLink } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    Nav,
} from 'reactstrap'

import ListSchedules from './list'
import NewSchedule from './new'
import EditSchedule from './edit'


class Schedule extends React.Component {
    constructor (props) {
        super(props)
    }

    componentDidMount () {

    }

    componentWillReceiveProps (nextProps) {
    }

    onClick (e) {
        e.preventDefault()
    }

    render () {
        return (
            <Switch>
                <Route
                    exact
                    path={`/app/sites/${this.props.site.get('id')}/details/sample-schedule`}
                    component={props => <ListSchedules site={this.props.site} {...props} />}
                />
                <Route
                    exact
                    path={`/app/sites/${this.props.site.get('id')}/details/sample-schedule/new`}
                    component={props => <NewSchedule site={this.props.site} {...props} />}
                />
                <Route
                    exact
                    path={`/app/sites/${this.props.site.get('id')}/details/sample-schedule/:id`}
                    component={props => <EditSchedule site={this.props.site} {...props} />}
                />
            </Switch>
        )
    }
}

const mapStateToProps = store => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Schedule)
