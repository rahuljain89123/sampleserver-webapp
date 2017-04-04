
import React from 'react'
import { Row, Col } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import PrivateRoute from './Auth'

import EditSite from './Sites/EditSite'
import ProjectSiteUsers from './Sites/ProjectSiteUsers'
import SiteDownloads from './Sites/SiteDownloads'

import { fetchSite } from '../actions/sites'


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

        if (!site) {
            return null
        }

        return (
            <Row>
                <Col xs="2">
                    <h4 style={{ marginLeft: 15 }}>{site.get('title')}</h4>
                    <nav className="nav nav-pills flex-column">
                        <NavLink
                            to={`/app/sites/${site.get('id')}/downloads`}
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
                            exact
                            to={`/app/sites/${site.get('id')}`}
                            className="nav-link"
                            activeClassName="active"
                        >Site Details</NavLink>
                        <NavLink
                            to={`/app/sites/${site.get('id')}/users`}
                            className="nav-link"
                            activeClassName="active"
                        >Technicians</NavLink>
                    </nav>
                </Col>
                <Col xs="10">
                    <div className="card">
                        <div className="card-block">
                            <PrivateRoute
                                exact
                                path={`/app/sites/${site.get('id')}`}
                                component={props => (
                                    <div>
                                        <h4 style={{ marginBottom: 20 }}>Site Details</h4>
                                        <EditSite
                                            site={site}
                                            onSuccess={() => {}}
                                            {...props}
                                        />
                                    </div>
                                )}
                            />
                            <PrivateRoute
                                exact
                                path={`/app/sites/${site.get('id')}/downloads`}
                                component={props => <SiteDownloads site={site} {...props} />}
                            />
                            <PrivateRoute
                                exact
                                path={`/app/sites/${site.get('id')}/users`}
                                component={props => <ProjectSiteUsers site={site} {...props} />}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
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
