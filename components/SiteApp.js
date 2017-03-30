
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
                            to={`/app/sites/${site.get('id')}/reports`}
                            className="nav-link"
                            activeClassName="active"
                        >Reports</NavLink>
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
                                    <EditSite
                                        site={site}
                                        onSuccess={() => {}}
                                        {...props}
                                    />
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
