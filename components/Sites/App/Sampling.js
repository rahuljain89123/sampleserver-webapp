
import React from 'react'
import {
  Switch,
} from 'react-router-dom'
import { connect } from 'react-redux'
import PrivateRoute from 'components/Auth'
import SchedulesList from 'components/Sites/Sampling/Schedule/SchedulesList'
import NewSchedule from 'components/Sites/Sampling/Schedule/NewSchedule'
import EditSchedule from 'components/Sites/Sampling/Schedule/EditSchedule'
import QAQCForm from 'components/Sites/Sampling/QAQCPreferences/QAQCForm'
import StateSpecificInfoForm from 'components/Sites/Sampling/StateSpecificInfo/StateSpecificInfoForm'
import { fetchSite } from 'actions/sites'


class Sampling extends React.Component {
  render () {
    const { site } = this.props
    if (!site) { return null }
    if (!this.props.location.pathname.includes('sampling')) { return null }

    return (
      <div className="sampling has-navbar">
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/sampling/sample-schedule`}
          component={props => <SchedulesList site={site} {...props} />}
        />
        <Switch>
          <PrivateRoute
            exact
            path={`/app/sites/${site.get('id')}/sampling/sample-schedule/new`}
            component={props => <NewSchedule site={site} {...props} />}
          />
          <PrivateRoute
            exact
            path={`/app/sites/${site.get('id')}/sampling/sample-schedule/:id`}
            component={props => <EditSchedule site={site} {...props} />}
          />
        </Switch>
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/sampling/qa-qc-preferences`}
          component={props => <QAQCForm site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/sampling/state-specific-info`}
          component={props => <StateSpecificInfoForm site={site} {...props} />}
        />
      </div>
    )
  }
}

const mapStateToProps = store => ({
  sites: store.get('sites'),
})

const mapDispatchToProps = dispatch => ({
  fetchSite: id => dispatch(fetchSite(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sampling)
