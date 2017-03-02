
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import { Button } from '../basecoat/Button'

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
                        <div>
                            <div className="clearfix">
                                <h3 className="float-left">Site: {site.get('title')}</h3>
                                <Button
                                    primary
                                    link
                                    href={`/app/sites/${site.get('site_id')}/edit`}
                                    className="float-right"
                                >Edit Site</Button>
                            </div>
                            <SiteInfo site={site} />
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
                                <Button
                                    link
                                    href={`/app/sites/${site.get('site_id')}`}
                                    className="float-right"
                                >Back</Button>
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
