
import React from 'react'
import { connect } from 'react-redux'

import {
  resizedImageUrl
} from 'helpers/filestack'

import {
  fetchSiteMap
} from 'actions/siteMaps.js'

class SiteMap extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.fetchSiteMap(this.props.siteMapId)
  }

  render () {
    const siteMap = this.props.siteMaps.get(this.props.siteMapId)
    if (!siteMap) { return null }

    const imageUrl = resizedImageUrl(siteMap.get('url'), { width: 640, height: 640, fit: 'scale' })
    return (
      <div className="site-map">
        <h2> {siteMap.get('title')} </h2>
        <img src={imageUrl} />
      </div>
    )
  }
}

const mapStateToProps = (store, props) => ({
  siteMaps: store.get('siteMaps'),
  siteMapId: parseInt(props.match.params.id, 10),
})

const mapDispatchToProps = dispatch => ({
  fetchSiteMap: (id) => dispatch(fetchSiteMap(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteMap)
