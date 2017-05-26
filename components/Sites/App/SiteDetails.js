
import React from 'react'
import {
  Switch,
} from 'react-router-dom'
import { connect } from 'react-redux'
import PrivateRoute from 'components/Auth'
import EditSite from 'components/Sites/EditSite'
import Wells from 'components/Sites/SiteDetails/Wells/list'
import SchedulesList from 'components/Sites/SiteDetails/Schedule/SchedulesList'
import NewSchedule from 'components/Sites/SiteDetails/Schedule/NewSchedule'
import EditSchedule from 'components/Sites/SiteDetails/Schedule/EditSchedule'
import EditExecutiveSummaryForm from 'components/Sites/SiteDetails/ExecutiveSummary/EditExecutiveSummaryForm'
import EditWell from 'components/Wells/EditWell'
import NewWell from 'components/Wells/NewWell'
import SiteMapsList from 'components/Sites/SiteDetails/SiteMaps/SiteMapsList'
import SiteMap from 'components/Sites/SiteDetails/SiteMaps/SiteMap'
import NewSiteMap from 'components/Sites/SiteDetails/SiteMaps/NewSiteMap'
import LabDataUpload from 'components/Sites/LabDataUpload'
import FieldDataUpload from 'components/Sites/FieldDataUpload'
import QAQCForm from 'components/Sites/SiteDetails/QAQCPreferences/QAQCForm'
import StateSpecificInfoForm from 'components/Sites/SiteDetails/StateSpecificInfo/StateSpecificInfoForm'
import { fetchSite } from 'actions/sites'


class SiteDetails extends React.Component {
  render () {
    const { site } = this.props
    if (!site) { return null }

    return (
      <div className="site-details">
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/details/edit-site`}
          component={props => (
            <EditSite
              site={site}
              onSuccess={() => {}}
              {...props}
            />
          )}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/details/executive-summary`}
          component={props => <EditExecutiveSummaryForm site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/details/wells`}
          component={props => <Wells site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/details/sample-schedule`}
          component={props => <SchedulesList site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/details/sample-schedule/new`}
          component={props => <NewSchedule site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/details/sample-schedule/:id(\\d+)`}
          component={props => <EditSchedule site={site} {...props} />}
        />
        <Switch>
          <PrivateRoute
            exact
            path={`/app/sites/${site.get('id')}/details/site-maps/new`}
            component={props => <NewSiteMap site={site} {...props} />}
          />
          <PrivateRoute
            exact
            path={`/app/sites/${site.get('id')}/details/site-maps/:id`}
            component={props => <SiteMap site={site} {...props} />}
          />
        </Switch>
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/details/site-maps`}
          component={props => <SiteMapsList site={site} {...props} />}
        />

        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/details/qa-qc-preferences`}
          component={props => <QAQCForm site={site} {...props} />}
        />

        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/details/state-specific-info`}
          component={props => <StateSpecificInfoForm site={site} {...props} />}
        />

        <Switch>
          <PrivateRoute
            exact
            path={`/app/sites/${site.get('id')}/details/wells/new`}
            component={props => (
              <NewWell
                site={site}
                onSuccess={() => props.push(`/app/sites/${site.get('id')}/details/wells`)}
                {...props}
              />
            )}
          />
          <PrivateRoute
            exact
            path={`/app/sites/${site.get('id')}/details/wells/:id`}
            component={props => (
              <EditWell
                site={site}
                onSuccess={() => props.push(`/app/sites/${site.get('id')}/details/wells`)}
                {...props}
              />
            )}
          />
        </Switch>
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

export default connect(mapStateToProps, mapDispatchToProps)(SiteDetails)
