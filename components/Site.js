
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { Row, Col, Button } from 'reactstrap'

import LinkButton from './LinkButton'
import EditSiteForm from './EditSiteForm'
import { fetchSite } from '../actions/sites'

const SiteInfo = props => (
    <div>
        <strong>Title: </strong><span>{props.site.get('title')}</span><br />
    </div>
)

class Site extends React.Component {
    constructor (props) {
        super(props)

        const siteId = parseInt(props.match.params.id, 10)
        const site = props.sites.get(siteId)

        this.state = {
            siteId,
            site,
        }
    }

    componentDidMount () {
        if (!this.state.site) {
            this.props.fetchSite(this.state.siteId)
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            site: nextProps.sites.get(this.state.siteId),
        })
    }

    render () {
        const site = this.state.site

        if (!site) {
            return null
        }

        return (
            <Switch>
                <Route
                    exact
                    path="/app/sites/:id(\\d+)"
                    render={() => (
                        <div className="card">
                          <div className="card-block">
                            <div className="card-title d-flex flex-row">
                                <h4>Site: {site.get('title')}</h4>
                                <span className="ml-auto">
                                    <LinkButton
                                        color="primary"
                                        href={`/app/sites/${site.get('site_id')}/edit`}
                                    >Edit Site</LinkButton>
                                </span>
                            </div>
                            <SiteInfo site={site} />
                          </div>
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/app/sites/:id(\\d+)/edit"
                    render={() => (
                        <div className="card">
                          <div className="card-block">
                            <div className="card-title d-flex flex-row">
                                <h4>Edit site: {site.get('title')}</h4>
                                <LinkButton
                                    href={`/app/sites/${site.get('site_id')}`}
                                    className="ml-auto"
                                >Back</LinkButton>
                            </div>
                            <Row>
                                <Col sm={6}>
                                    <EditSiteForm site={site} />
                                </Col>
                            </Row>
                          </div>
                        </div>
                    )}
                />
            </Switch>
        )
    }
}

const mapStateToProps = store => ({
    sites: store.get('sites'),
})

const mapDispatchToProps = dispatch => ({
    fetchSite: id => dispatch(fetchSite(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Site)
