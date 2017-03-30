
import React from 'react'
import { connect } from 'react-redux'

import PrivateRoute from '../Auth'
import Breadcrumbs from '../Breadcrumbs'
import LinkButton from '../LinkButton'

import SiteInfo from './SiteInfo'
import EditSite from './EditSite'
import ProjectSiteUsers from './ProjectSiteUsers'

import { fetchSite } from '../../actions/sites'


class AdminSite extends React.Component {
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

        const editing = this.props.location.pathname.endsWith('/edit')
        const breadcrumbItems = editing ? [
            { href: '/app/sites', title: 'Sites' },
            { href: `/app/sites/${site.get('id')}`, title: site.get('title') },
            { title: 'Edit Site', active: true },
        ] : [
            { href: '/app/sites', title: 'Sites' },
            { title: site.get('title'), active: true },
        ]
        const actionButton = editing ? (
            <LinkButton
                className="ml-auto"
                href={`/app/sites/${site.get('id')}`}
            >Back</LinkButton>
        ) : (
            <LinkButton
                className="ml-auto"
                color="primary"
                href={`/app/sites/${site.get('id')}/edit`}
            >Edit Site</LinkButton>
        )

        return (
            <div>
                <Breadcrumbs items={breadcrumbItems} style={{ marginBottom: 30 }} />
                <div className="card">
                    <div className="card-block">
                        <div className="card-title d-flex flex-row">
                            <h4>{site.get('title')}</h4>
                            {actionButton}
                        </div>
                        <PrivateRoute
                            exact
                            path={`/app/sites/${site.get('id')}`}
                            component={props => <SiteInfo site={site} {...props} />}
                        />
                        <PrivateRoute
                            exact
                            path={`/app/sites/${site.get('id')}/edit`}
                            component={props => (
                                <EditSite
                                    site={site}
                                    onSuccess={id => props.push(`/app/sites/${id}`)}
                                    {...props}
                                />
                            )}
                        />
                        <PrivateRoute
                            exact
                            path={`/app/sites/${site.get('id')}/users`}
                            component={props => <ProjectSiteUsers site={site} {...props} />}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    sites: store.get('sites'),
})

const mapDispatchToProps = dispatch => ({
    fetchSite: id => dispatch(fetchSite(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminSite)
