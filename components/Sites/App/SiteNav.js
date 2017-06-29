import React from 'react'
import { connect } from 'react-redux'

import PrivateRoute from 'components/Auth'
import { fetchSite } from 'actions/sites'
import { fetchClients } from 'actions/clients'

import {
  NavLink,
} from 'react-router-dom'
import {
  currentUser,
  currentUserRole,
  currentLab,
  safeGet,
  currentCompany,
} from 'normalizers'


class SiteNav extends React.Component {
  constructor (props) {
    super(props)

    const siteId = parseInt(props.match.params.id, 10)

    this.state = {
      open: true,
      dropdownOpen: false,
      siteId,
    }
  }

  componentDidMount () {
    if (!this.props.sites.get(this.state.siteId)) {
      this.props.fetchSite(this.state.siteId)
    }
    if (!this.props.clients.size) {
      this.props.fetchClients()
    }
  }

  getAppTitle () {
    if (this.props.clients.size && this.props.sites.size) {
      const site = this.props.sites.get(this.state.siteId)
      const client = this.props.clients.get(site.get('client_id'))
      return client.get('name')
    }
    if (this.props.company) {
      return this.props.company.get('title')
    }
    return this.props.labTitle
  }

  render () {
    const site = this.props.sites.get(this.state.siteId)
    if (!site) { return null }

    return (
      <div className="sidebar-nav">
        <div className="site-info">
          <h4>{this.getAppTitle()}</h4>
          <h2>{site.get('title')}</h2>
        </div>
        <nav className="nav nav-pills flex-column">
          <NavLink
            exact
            to={`/app/`}
            className="nav-link nav-parent"
            activeClassName="active"
          ><i className="fa fa-chevron-left" aria-hidden="true"></i> Dashboard</NavLink>
          <NavLink
            to={`/app/sites/${site.get('id')}/reports/analytical-tables`}
            className="nav-link nav-parent"
            activeClassName="active"
          >Reports</NavLink>
          <PrivateRoute
            path={`/app/sites/${site.get('id')}/reports`}
            component={() => (
              <nav className="nav nav-pills nav-children flex-column">
                <NavLink
                  to={`/app/sites/${site.get('id')}/reports/analytical-tables`}
                  className="nav-link"
                  activeClassName="active"
                >Analytical Tables</NavLink>
                <NavLink
                  to={`/app/sites/${site.get('id')}/reports/analytical-boxmaps`}
                  className="nav-link"
                  activeClassName="active"
                >Analytical Boxmaps</NavLink>
                <NavLink
                  to={`/app/sites/${site.get('id')}/reports/isochemical-contours`}
                  className="nav-link"
                  activeClassName="active"
                >Isochemical Contours</NavLink>
                <NavLink
                  to={`/app/sites/${site.get('id')}/reports/groundwater-contours`}
                  className="nav-link"
                  activeClassName="active"
                >Groundwater Contours</NavLink>
                <NavLink
                  to={`/app/sites/${site.get('id')}/reports/free-product-contours`}
                  className="nav-link"
                  activeClassName="active"
                >Free Product Contours</NavLink>
              </nav>
            )}
          />
          <NavLink
            to={`/app/sites/${site.get('id')}/lab-data-list`}
            className="nav-link nav-parent"
            activeClassName="active"
          >Downloads</NavLink>
          <NavLink
            to={`/app/sites/${site.get('id')}/setup/edit-site`}
            className="nav-link nav-parent"
            activeClassName="active"
          >Site Setup</NavLink>
          <PrivateRoute
            path={`/app/sites/${site.get('id')}/setup`}
            component={() => (
              <nav className="nav nav-pills flex-column nav-children">
                <NavLink
                  exact
                  to={`/app/sites/${site.get('id')}/setup/edit-site`}
                  className="nav-link"
                  activeClassName="active"
                >Edit Site</NavLink>
                <NavLink
                  to={`/app/sites/${site.get('id')}/setup/wells`}
                  className="nav-link"
                  activeClassName="active"
                >Edit Wells</NavLink>
                <NavLink
                  exact
                  to={`/app/sites/${site.get('id')}/setup/site-maps`}
                  className="nav-link"
                  activeClassName="active"
                >Edit Site Maps</NavLink>
                <NavLink
                  exact
                  to={`/app/sites/${site.get('id')}/setup/executive-summary`}
                  className="nav-link"
                  activeClassName="active"
                >Executive Summary+</NavLink>
              </nav>
            )}
          />
          <NavLink
            to={`/app/sites/${site.get('id')}/sampling/sample-schedule`}
            className="nav-link nav-parent"
            activeClassName="active"
          >Sampling</NavLink>
          <PrivateRoute
            path={`/app/sites/${site.get('id')}/sampling`}
            component={() => (
              <nav className="nav nav-pills flex-column nav-children">
                <NavLink
                  exact
                  to={`/app/sites/${site.get('id')}/sampling/sample-schedule`}
                  className="nav-link"
                  activeClassName="active"
                >Sample Schedule</NavLink>
                <NavLink
                  exact
                  to={`/app/sites/${site.get('id')}/sampling/qa-qc-preferences`}
                  className="nav-link"
                  activeClassName="active"
                >QA/QC Preferences</NavLink>

                {site.get('state_id') === 35 && <NavLink
                  exact
                  to={`/app/sites/${site.get('id')}/sampling/state-specific-info`}
                  className="nav-link"
                  activeClassName="active"
                >State Specific Info</NavLink>}
              </nav>
            )}
          />
          <NavLink
            to={`/app/sites/${site.get('id')}/data-import/field-data`}
            className="nav-link nav-parent"
            activeClassName="active"
          >Import Data</NavLink>
          <PrivateRoute
            path={`/app/sites/${site.get('id')}/data-import`}
            component={() => (
              <nav className="nav nav-pills nav-children flex-column">
                <NavLink
                  exact
                  to={`/app/sites/${site.get('id')}/data-import/field-data`}
                  className="nav-link"
                  activeClassName="active"
                >Field Data</NavLink>
                <NavLink
                  exact
                  to={`/app/sites/${site.get('id')}/data-import/lab-data`}
                  className="nav-link"
                  activeClassName="active"
                >Lab Data</NavLink>
              </nav>
            )}
          />
          <NavLink
            to={`/app/sites/${site.get('id')}/users`}
            className="nav-link nav-parent"
            activeClassName="active"
          >Technicians</NavLink>
          <NavLink
            to={`/app/sites/${site.get('id')}/contacts`}
            className="nav-link nav-parent"
            activeClassName="active"
          >Contacts</NavLink>
        </nav>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  sites: store.get('sites'),
  clients: store.get('clients'),
  company: currentCompany(store),
})

const mapDispatchToProps = dispatch => ({
  fetchSite: id => dispatch(fetchSite(id)),
  fetchClients: () => dispatch(fetchClients()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteNav)
