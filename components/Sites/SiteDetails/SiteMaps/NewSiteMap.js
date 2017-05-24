import React from 'react'
import { connect } from 'react-redux'

import SiteMapForm from './SiteMapForm'

import {
  createSiteMap,
} from 'actions/siteMaps'

import { flashMessage } from 'actions/global'

class NewSiteMap extends React.Component {
  constructor (props) {
    super(props)

    this.createSiteMap = this.createSiteMap.bind(this)
  }

  createSiteMap (siteMapParams) {
    const siteId = this.props.site.get('id')
    siteMapParams = siteMapParams.set('site_id', siteId)

    this.props.createSiteMap(siteMapParams).then((siteMapId) => {
      this.props.flashMessage('success', 'Sitemap successfully uploaded')
      this.props.push(`/app/sites/${siteId}/details/site-maps/${siteMapId}`)
    })
    .catch(() => this.props.flashMessage('danger', 'Sorry, there was an error.'))
  }

  render () {
    return (<SiteMapForm
      onSubmit={this.createSiteMap}
      buttonText='Create'
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  createSiteMap: siteMapParams => dispatch(createSiteMap(siteMapParams)),
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
})

export default connect(null, mapDispatchToProps)(NewSiteMap)
