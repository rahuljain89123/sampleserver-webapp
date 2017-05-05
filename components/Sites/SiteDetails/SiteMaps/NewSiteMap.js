import React from 'react'
import { connect } from 'react-redux'

import SiteMapForm from './SiteMapForm'

import {
  createSiteMap,
} from 'actions/siteMaps'

class NewSiteMap extends React.Component {
  constructor (props) {
    super(props)

    this.createSiteMap = this.createSiteMap.bind(this)
  }

  createSiteMap (siteMapParams) {
    const siteId = this.props.site.get('id')
    siteMapParams = siteMapParams.set('site_id', siteId)

    this.props.createSiteMap(siteMapParams).then((siteMapId) => {
      this.props.push(`/app/sites/${siteId}/details/site-maps/${siteMapId}`)
    })
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
})

export default connect(null, mapDispatchToProps)(NewSiteMap)
