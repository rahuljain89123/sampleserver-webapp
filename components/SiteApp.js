
import React from 'react'
import { Row, Col } from 'reactstrap'
import {
  NavLink,
} from 'react-router-dom'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router'

import PrivateRoute from './Auth'
import SiteNav from 'components/Sites/App/SiteNav'
import ProjectSiteUsers from './Sites/ProjectSiteUsers'
import SiteContacts from './Sites/SiteContacts'
import NewSiteContact from './Sites/NewSiteContact'
import EditSiteContact from './Sites/EditSiteContact'

import LabDataList from './Sites/LabDataList'
import LabDataUpload from './Sites/LabDataUpload'
import FieldDataUpload from './Sites/FieldDataUpload'

import { Breadcrumb, BreadcrumbItem } from 'reactstrap'

import SiteDetails from 'components/Sites/App/SiteDetails'

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
    if (!site) { return null }

    return (
      <Row>
        <Col xs="2">
          <h4 style={{ marginLeft: 15 }}>{site.get('title')}</h4>
          <SiteNav site={site} />
        </Col>
        <Col xs="10">
          <div className="card">
            <div className="card-block">
              <SiteDetails site={site} />

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
