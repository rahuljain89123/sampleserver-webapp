import React from 'react'
import { connect } from 'react-redux'

import PrivateRoute from 'components/Auth'
import { fetchSite } from 'actions/sites'

import {
  NavLink,
} from 'react-router-dom'

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
  }

  render () {
    const site = this.props.sites.get(this.state.siteId)
    console.log(site)
    if (!site) { return null }

    return (
      <nav className="nav nav-pills flex-column">
        <NavLink
          exact
          to={`/app/`}
          className="nav-link nav-parent"
          activeClassName="active"
        ><i className="fa fa-chevron-left" aria-hidden="true"></i> Dashboard</NavLink>
        <NavLink
          to={`/app/sites/${site.get('id')}/lab-data-list`}
          className="nav-link nav-parent"
          activeClassName="active"
        >Downloads</NavLink>
        <NavLink
          to={`/app/sites/${site.get('id')}/reports`}
          className="nav-link nav-parent"
          activeClassName="active"
        >Regulatory Reports</NavLink>
        <PrivateRoute
          path={`/app/sites/${site.get('id')}/reports`}
          component={() => (
            <nav className="nav nav-pills nav-children flex-column">
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
          to={`/app/sites/${site.get('id')}/details/info`}
          className="nav-link nav-parent"
          activeClassName="active"
        >Site Details</NavLink>
        <PrivateRoute
          path={`/app/sites/${site.get('id')}/details`}
          component={() => (
            <nav className="nav nav-pills flex-column nav-children">
              <NavLink
                exact
                to={`/app/sites/${site.get('id')}/details/info`}
                className="nav-link"
                activeClassName="active"
              >Info</NavLink>
              <NavLink
                to={`/app/sites/${site.get('id')}/details/wells`}
                className="nav-link"
                activeClassName="active"
              >Wells</NavLink>
              <NavLink
                exact
                to={`/app/sites/${site.get('id')}/details/sample-schedule`}
                className="nav-link"
                activeClassName="active"
              >Sample Schedule</NavLink>
              <NavLink
                exact
                to={`/app/sites/${site.get('id')}/details/qa-qc-preferences`}
                className="nav-link"
                activeClassName="active"
              >QA/QC Preferences</NavLink>
              <NavLink
                exact
                to={`/app/sites/${site.get('id')}/details/site-maps`}
                className="nav-link"
                activeClassName="active"
              >Site Maps</NavLink>
              <NavLink
                exact
                to={`/app/sites/${site.get('id')}/details/executive-summary`}
                className="nav-link"
                activeClassName="active"
              >Executive Summary+</NavLink>
              <NavLink
                exact
                to={`/app/sites/${site.get('id')}/details/field-data-input`}
                className="nav-link"
                activeClassName="active"
              >Field Data Input</NavLink>
              <NavLink
                exact
                to={`/app/sites/${site.get('id')}/details/lab-data-input`}
                className="nav-link"
                activeClassName="active"
              >Lab Data Input</NavLink>
              {site.get('state_id') === 35 && <NavLink
                exact
                to={`/app/sites/${site.get('id')}/details/state-specific-info`}
                className="nav-link"
                activeClassName="active">
                State Specific Info</NavLink>}
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
    )
  }
}

const mapStateToProps = store => ({
  sites: store.get('sites'),
})

const mapDispatchToProps = dispatch => ({
  fetchSite: id => dispatch(fetchSite(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteNav)

