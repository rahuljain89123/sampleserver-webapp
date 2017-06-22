
import React from 'react'
import { Row, Col } from 'reactstrap'
import {
  NavLink,
} from 'react-router-dom'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router'

import PrivateRoute from 'components/Auth'
import SiteNav from 'Sites/App/SiteNav'
import ClientSiteUsers from 'Sites/ClientSiteUsers'
import ContactsList from 'Sites/Contacts/ContactsList'
import NewSiteContact from 'Sites/Contacts/NewSiteContact'
import EditSiteContact from 'Sites/Contacts/EditSiteContact'

import LabDataList from 'Sites/LabDataList'

import { Breadcrumb, BreadcrumbItem } from 'reactstrap'

import SiteSetup from 'Sites/App/SiteSetup'
import Sampling from 'Sites/App/Sampling'
import SiteDataImport from 'Sites/App/SiteDataImport'
import SiteReports from 'Sites/App/SiteReports'

import { fetchSite } from 'actions/sites'
import { flashMessage } from 'actions/global'

class SiteApp extends React.Component {

  componentDidMount () {
    const siteId = parseInt(this.props.match.params.id, 10)
    if (!this.props.sites.get(siteId) && siteId) {
      this.props.fetchSite(siteId)
    }
  }

  render () {
    const siteId = parseInt(this.props.match.params.id, 10)

    const site = this.props.sites.get(siteId)
    if (!site) { return null }
    else if (!this.props.location.pathname.includes('edit-site') && (!site.get('state_id') || !site.get('city'))) {
      console.log('redirecting')
      this.props.flashMessage('warning', `Please set up ${site.get('title')} by filling out all required fields.`)
      this.props.push(`/app/sites/${site.get('id')}/setup/edit-site`)
    }

    return (
      <div className="app">
        <SiteSetup site={site} location={this.props.location} />
        <Sampling  site={site} location={this.props.location} />

        <PrivateRoute
          path={`/app/sites/${site.get('id')}/data-import`}
          component={props => <SiteDataImport site={site} {...props} />}
        />
        <PrivateRoute
          path={`/app/sites/${site.get('id')}/reports`}
          component={props => <SiteReports site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/lab-data-list`}
          component={props => <LabDataList site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/users`}
          component={props => <ClientSiteUsers site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/contacts`}
          component={props => <ContactsList site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/contacts/new`}
          component={props => (
            <NewSiteContact
              site={site}
              {...props}
            />
          )}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/contacts/:id`}
          component={props => (
            <EditSiteContact
              site={site}

              {...props}
            />
          )}
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
  flashMessage: (type, message) => dispatch(flashMessage(type, message))
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteApp)
