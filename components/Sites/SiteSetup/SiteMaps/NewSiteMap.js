import React from 'react'
import { connect } from 'react-redux'

import SiteMapForm from './SiteMapForm'

import {
  createSiteMap,
} from 'actions/siteMaps'

import { flashMessage, setHeaderInfo } from 'actions/global'

class NewSiteMap extends React.Component {
  constructor (props) {
    super(props)

    this.createSiteMap = this.createSiteMap.bind(this)
  }

  componentDidMount () {

    this.props.setHeaderInfo(
      'New Sitemap',
    )
  }

  createSiteMap (siteMapParams) {
    const siteId = this.props.site.get('id')
    siteMapParams = siteMapParams.set('site_id', siteId)

    this.props.createSiteMap(siteMapParams).then((siteMapId) => {
      this.props.flashMessage('success', 'Sitemap successfully uploaded')
      this.props.push(`/app/sites/${siteId}/setup/site-maps/${siteMapId}`)
      window.analytics.track('site map created', {
        sitemap_id: siteMapId,
      })
    })
    .catch(() => this.props.flashMessage('danger', 'Sorry, there was an error.'))
  }

  render () {
    return (
      <div className="row new-sitemap has-navbar">
        <div className="col-md-8">
          <SiteMapForm
            onSubmit={this.createSiteMap}
            buttonText="Create Sitemap"
          />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  createSiteMap: siteMapParams => dispatch(createSiteMap(siteMapParams)),
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(null, mapDispatchToProps)(NewSiteMap)
