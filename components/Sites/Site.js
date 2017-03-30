
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import {
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap'

import LinkButton from '../LinkButton'
import { fetchSite } from '../../actions/sites'
import EditSiteForm from './EditSiteForm'

const SiteInfo = props => (
    <div>
        <strong>Title: </strong><span>{props.site.get('title')}</span><br />
        <strong>Contact: </strong><span>{props.site.get('contact')}</span><br />
        <strong>Contact phone: </strong><span>{props.site.get('contact_phone')}</span><br />
        <strong>Contact email: </strong><span>{props.site.get('contact_email')}</span><br />
        <strong>Notes: </strong><span>{props.site.get('notes')}</span><br />
        <strong>Address: </strong><span>{props.site.get('address')}</span><br />
        <strong>City: </strong><span>{props.site.get('city')}</span><br />
        <strong>State: </strong><span>{props.site.get('state')}</span><br />
        <strong>Zip: </strong><span>{props.site.get('zip')}</span><br />
        <strong>County: </strong><span>{props.site.get('county')}</span><br />
        <strong>Latitude: </strong><span>{props.site.get('latitude')}</span><br />
        <strong>Longitude: </strong><span>{props.site.get('longitude')}</span><br />
        <strong>Start sampling on: </strong><span>{props.site.get('start_sampling_on')}</span><br />
        <strong>History: </strong><span dangerouslySetInnerHTML={{ __html: props.site.get('history') }} /><br />
        <strong>Background: </strong><span dangerouslySetInnerHTML={{ __html: props.site.get('background') }} /><br />
        <strong>Summary: </strong><span dangerouslySetInnerHTML={{ __html: props.site.get('summary') }} /><br />
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

    onClick (e) {
        e.preventDefault()
        this.props.push(e.target.getAttribute('href'))
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
                            <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
                                <BreadcrumbItem
                                    tag="a"
                                    href="/app/sites"
                                    onClick={e => this.onClick(e)}
                                >
                                    Sites
                                </BreadcrumbItem>
                                <BreadcrumbItem className="active">
                                    {site.get('title')}
                                </BreadcrumbItem>
                            </Breadcrumb>
                            <div className="card">
                                <div className="card-block">
                                    <div className="card-title d-flex flex-row">
                                        <h4>{site.get('title')}</h4>
                                        <span className="ml-auto">
                                            <LinkButton
                                                href={`/app/sites/${site.get('id')}/users`}
                                            >Manage Users</LinkButton>
                                            <LinkButton
                                                color="primary"
                                                href={`/app/sites/${site.get('id')}/edit`}
                                                style={{ marginLeft: 10 }}
                                            >Edit Site</LinkButton>
                                        </span>
                                    </div>
                                    <SiteInfo site={site} />
                                </div>
                            </div>
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/app/sites/:id(\\d+)/edit"
                    render={() => (
                        <div>
                            <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
                                <BreadcrumbItem
                                    tag="a"
                                    href="/app/sites"
                                    onClick={e => this.onClick(e)}
                                >
                                    Sites
                                </BreadcrumbItem>
                                <BreadcrumbItem
                                    tag="a"
                                    href={`/app/sites/${site.get('id')}`}
                                    onClick={e => this.onClick(e)}
                                >
                                    {site.get('title')}
                                </BreadcrumbItem>
                                <BreadcrumbItem className="active">
                                    Edit Site
                                </BreadcrumbItem>
                            </Breadcrumb>
                            <div className="card">
                                <div className="card-block">
                                    <div className="card-title d-flex flex-row">
                                        <h4>{site.get('title')}</h4>
                                        <LinkButton
                                            href={`/app/sites/${site.get('id')}`}
                                            className="ml-auto"
                                        >Back</LinkButton>
                                    </div>
                                    <Row>
                                        <Col sm={6}>
                                            <EditSiteForm
                                                site={site}
                                                onSuccess={id => this.props.push(`/app/sites/${id}`)}
                                            />
                                        </Col>
                                    </Row>
                                </div>
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
