
import React from 'react'
import { Row, Col } from 'reactstrap'
import {
  NavLink,
  Switch,
} from 'react-router-dom'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router'

import PrivateRoute from './Auth'

import EditSite from './Sites/EditSite'
import ProjectSiteUsers from './Sites/ProjectSiteUsers'
import SiteContacts from './Sites/SiteContacts'
import NewSiteContact from './Sites/NewSiteContact'
import EditSiteContact from './Sites/EditSiteContact'
import LabDataList from './Sites/LabDataList'
import Wells from './Sites/SiteDetails/Wells/list'
import ListSchedules from './Sites/SiteDetails/Schedule/list'
import NewSchedule from './Sites/SiteDetails/Schedule/new'
import EditSchedule from './Sites/SiteDetails/Schedule/edit'
import EditExecutiveSummaryForm from './Sites/SiteDetails/ExecutiveSummary/EditExecutiveSummaryForm'
import LabDataUpload from './Sites/LabDataUpload'
import FieldDataUpload from './Sites/FieldDataUpload'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap'
import EditWell from './Wells/EditWell'
import NewWell from './Wells/NewWell'

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
                            to={`/app/sites/${site.get('id')}/lab-data-list`}
                            className="nav-link"
                            activeClassName="active"
                        >Lab Data</NavLink>
                        <Route
                            exact
                            path={`/app/sites/${site.get('id')}`}
                            render={() => (
                                <Redirect to={`/app/sites/${site.get('id')}/lab-data-list`}/>
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
                                        to={`/app/sites/${site.get('id')}/reports/analytical-results-map`}
                                        className="nav-link"
                                        activeClassName="active"
                                    >Analytical Results Map</NavLink>
                                    <NavLink
                                        to={`/app/sites/${site.get('id')}/reports/isochemical-contours`}
                                        className="nav-link"
                                        activeClassName="active"
                                    >Isochemical Contours</NavLink>
                                    <NavLink
                                        to={`/app/sites/${site.get('id')}/reports/groundater-contours`}
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
                </Col>
                <Col xs="10">
                    <div className="card">
                        <div className="card-block">
                            <PrivateRoute
                                exact
                                path={`/app/sites/${site.get('id')}/details/info`}
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
                                path={`/app/sites/${site.get('id')}/details/executive-summary`}
                                component={props => <EditExecutiveSummaryForm site={site} {...props} />}
                            />
                            <PrivateRoute
                                exact
                                path={`/app/sites/${site.get('id')}/details/field-data-input`}
                                component={props => <FieldDataUpload site={site} {...props} />}
                            />
                            <PrivateRoute
                                exact
                                path={`/app/sites/${site.get('id')}/details/lab-data-input`}
                                component={props => <LabDataUpload site={site} {...props} />}
                            />
                            <PrivateRoute
                                exact
                                path={`/app/sites/${site.get('id')}/details/wells`}
                                component={props => <Wells site={site} {...props} />}
                            />
                            <PrivateRoute
                                exact
                                path={`/app/sites/${site.get('id')}/details/sample-schedule`}
                                component={props => <ListSchedules site={site} {...props} />}
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
                                component={props => <SiteContacts site={site} {...props} />}
                            />
                            <PrivateRoute
                                exact
                                path={`/app/sites/${site.get('id')}/contacts/new`}
                                component={props => (
                                    <NewSiteContact
                                        site={site}
                                        onSuccess={() => props.push(`/app/sites/${site.get('id')}/contacts`)}
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
                                        onSuccess={() => props.push(`/app/sites/${site.get('id')}/contacts`)}
                                        {...props}
                                    />
                                )}
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
