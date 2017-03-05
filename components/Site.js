
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

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
                            <h4 className="card-title">Site: {site.get('title')}</h4>
                            <p className="card-text">
                                <SiteInfo site={site} />
                            </p>
                            <LinkButton
                                color="primary"
                                href={`/app/sites/${site.get('site_id')}/edit`}
                            >Edit Site</LinkButton>
                          </div>
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/app/sites/:id(\\d+)/edit"
                    render={() => (
                        <div style={{ marginBottom: 50 }}>
                            <div className="clearfix">
                                <h3 className="float-left">Edit site: {site.get('title')}</h3>
                                <LinkButton
                                    href={`/app/sites/${site.get('site_id')}`}
                                    className="float-right"
                                >Back</LinkButton>
                            </div>
                            <EditSiteForm site={site} />
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
