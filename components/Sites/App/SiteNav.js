import React from 'react'

import PrivateRoute from 'components/Auth'

import {
  NavLink,
} from 'react-router-dom'

const SiteNav = (props) => {
  const { site } = props

  return (
    <nav className="nav nav-pills flex-column">
      <NavLink
        to={`/app/sites/${site.get('id')}/lab-data-list`}
        className="nav-link"
        activeClassName="active"
      >Downloads</NavLink>
      <NavLink
        to={`/app/sites/${site.get('id')}/pre-sampling`}
        className="nav-link"
        activeClassName="active"
      >Pre-Sampling Reports</NavLink>
      <PrivateRoute
        path={`/app/sites/${site.get('id')}/pre-sampling`}
        component={() => (
          <nav className="nav nav-pills flex-column" style={{ marginLeft: 20 }}>
            <NavLink
              to={`/app/sites/${site.get('id')}/pre-sampling/scope`}
              className="nav-link"
              activeClassName="active"
            >Work Scope</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/pre-sampling/sample-bottle-request`}
              className="nav-link"
              activeClassName="active"
            >Sample Bottle Request Report</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/pre-sampling/site-map`}
              className="nav-link"
              activeClassName="active"
            >Site Map</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/pre-sampling/on-site-activity`}
              className="nav-link"
              activeClassName="active"
            >Notice of On-site Work Activity</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/pre-sampling/chain-custody`}
              className="nav-link"
              activeClassName="active"
            >Chain of Custody</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/pre-sampling/sample-bottle-labels`}
              className="nav-link"
              activeClassName="active"
            >Sample Bottle Labels</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/pre-sampling/field-data-form`}
              className="nav-link"
              activeClassName="active"
            >Field Data Form</NavLink>
          </nav>
        )}
      />
      <NavLink
        to={`/app/sites/${site.get('id')}/reports`}
        className="nav-link"
        activeClassName="active"
      >Regulatory Reports</NavLink>
      <PrivateRoute
        path={`/app/sites/${site.get('id')}/reports`}
        component={() => (
          <nav className="nav nav-pills flex-column" style={{ marginLeft: 20 }}>
            <NavLink
              to={`/app/sites/${site.get('id')}/reports/history`}
              className="nav-link"
              activeClassName="active"
            >Site History</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/reports/field-data-table`}
              className="nav-link"
              activeClassName="active"
            >Field Data Results Table</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/reports/field-data-graph`}
              className="nav-link"
              activeClassName="active"
            >Field Data Results Graph</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/reports/groundwater-elevation`}
              className="nav-link"
              activeClassName="active"
            >Groundwater Elevation</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/reports/analytical-results-map`}
              className="nav-link"
              activeClassName="active"
            >Analytical Results Map</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/reports/analytical-results-table`}
              className="nav-link"
              activeClassName="active"
            >Analytical Results Table</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/reports/analytical-results-graph`}
              className="nav-link"
              activeClassName="active"
            >Analytical Results Graph</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/reports/groundwater-map`}
              className="nav-link"
              activeClassName="active"
            >Groundwater Elevation Map</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/reports/thickness`}
              className="nav-link"
              activeClassName="active"
            >Free Product Thickness</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/reports/groundwater`}
              className="nav-link"
              activeClassName="active"
            >Free Product Groundwater</NavLink>
            <NavLink
              to={`/app/sites/${site.get('id')}/reports/wells`}
              className="nav-link"
              activeClassName="active"
            >Well Construction/Location</NavLink>
          </nav>
        )}
      />
      <NavLink
        to={`/app/sites/${site.get('id')}/details/info`}
        className="nav-link"
        activeClassName="active"
      >Site Details</NavLink>
      <PrivateRoute
        path={`/app/sites/${site.get('id')}/details`}
        component={() => (
          <nav className="nav nav-pills flex-column" style={{ marginLeft: 20 }}>
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
              to={`/app/sites/${site.get('id')}/details/site-activity-report`}
              className="nav-link"
              activeClassName="active"
            >Site Activity Report Info - MI</NavLink>
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
            >Executive Summary, Site History and Background Information</NavLink>
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
            <NavLink
              exact
              to={`/app/sites/${site.get('id')}/details/state-specific-info`}
              className="nav-link"
              activeClassName="active"
            >State Specific Required Information - MI</NavLink>
          </nav>
        )}
      />
      <NavLink
        to={`/app/sites/${site.get('id')}/users`}
        className="nav-link"
        activeClassName="active"
      >Technicians</NavLink>
      <NavLink
        to={`/app/sites/${site.get('id')}/contacts`}
        className="nav-link"
        activeClassName="active"
      >Contacts</NavLink>
    </nav>
  )
}

export default SiteNav
