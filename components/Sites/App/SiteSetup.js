
import React from 'react'
import {
  Switch,
} from 'react-router-dom'
import { connect } from 'react-redux'
import PrivateRoute from 'components/Auth'
import EditSite from 'components/Sites/EditSite'
import WellsList from 'components/Sites/SiteSetup/Wells/WellsList'
import EditWell from 'components/Wells/EditWell'
import NewWell from 'components/Wells/NewWell'
import SiteMapsList from 'components/Sites/SiteSetup/SiteMaps/SiteMapsList'
import SiteMap from 'components/Sites/SiteSetup/SiteMaps/SiteMap'
import NewSiteMap from 'components/Sites/SiteSetup/SiteMaps/NewSiteMap'
import { fetchSite } from 'actions/sites'


class SiteSetup extends React.Component {
  render () {
    const { site } = this.props
    if (!site) { return null }

    return (
      <div className="site-setup">
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/setup/edit-site`}
          component={props => (
            <EditSite
              site={site}
              onSuccess={() => {}}
              {...props}
            />
          )}
        />
        <Switch>
          <PrivateRoute
            exact
            path={`/app/sites/${site.get('id')}/setup/site-maps/new`}
            component={props => <NewSiteMap site={site} {...props} />}
          />
          <PrivateRoute
            exact
            path={`/app/sites/${site.get('id')}/setup/site-maps/:id`}
            component={props => <SiteMap site={site} {...props} />}
          />
        </Switch>
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/setup/site-maps`}
          component={props => <SiteMapsList site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/setup/wells`}
          component={props => <WellsList site={site} {...props} />}
        />
        <Switch>
          <PrivateRoute
            exact
            path={`/app/sites/${site.get('id')}/setup/wells/new`}
            component={props => (
              <NewWell
                site={site}
                onSuccess={() => props.push(`/app/sites/${site.get('id')}/setup/wells`)}
                {...props}
              />
            )}
          />
          <PrivateRoute
            exact
            path={`/app/sites/${site.get('id')}/setup/wells/:id`}
            component={props => (
              <EditWell
                site={site}
                onSuccess={() => props.push(`/app/sites/${site.get('id')}/setup/wells`)}
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

export default connect(mapStateToProps, mapDispatchToProps)(SiteSetup)