
import React from 'react'
import { Row, Col } from 'reactstrap'
import {
  NavLink,
} from 'react-router-dom'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router'

import PrivateRoute from './Auth'
import SiteNav from 'Sites/App/SiteNav'
import ProjectSiteUsers from 'Sites/ProjectSiteUsers'
import ContactsList from 'Sites/Contacts/ContactsList'
import NewSiteContact from 'Sites/Contacts/NewSiteContact'
import EditSiteContact from 'Sites/Contacts/EditSiteContact'

import LabDataList from 'Sites/LabDataList'

import { Breadcrumb, BreadcrumbItem } from 'reactstrap'

import SiteDetails from 'Sites/App/SiteDetails'
import SiteDataImport from 'Sites/App/SiteDataImport'
import SiteReports from 'Sites/App/SiteReports'

import { fetchSite } from 'actions/sites'

class SiteApp extends React.Component {
  constructor (props) {
    super(props)

    const siteId = parseInt(props.match.params.id, 10)

    this.state = {
      siteId,
    }
  }

  componentDidMount () {
    if (!this.props.sites.get(this.state.siteId)) {
      this.props.fetchSite(this.state.siteId)
    }
  }

  render () {
    const site = this.props.sites.get(this.state.siteId)
    if (!site) { return null }

    return (
      <div className="app">
        <SiteDetails site={site} />
        <SiteDataImport site={site} />
        <SiteReports site={site} />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/lab-data-list`}
          component={props => <LabDataList site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/users`}
          component={props => <ProjectSiteUsers site={site} {...props} />}
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
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteApp)
