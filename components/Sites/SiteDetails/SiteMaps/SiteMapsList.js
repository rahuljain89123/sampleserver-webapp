
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import filestack from 'filestack-js'

import {
  fetchSiteMaps,
  createSiteMap,
} from 'actions/siteMaps'

import {
  FILESTACK_API_KEY,
} from 'helpers/filestack'

const FILESTACK_OPTIONS = {
    accept: 'image/*',
    fromSources: ['local_file_system', 'dropbox'],
    transformOptions: {
      maxDimensions: [1280, 1280]
    },
}

class SiteMapsList extends React.Component {
  constructor (props) {
    super(props)

    this.uploadSiteMap = this.uploadSiteMap.bind(this)
    this.client = filestack.init(FILESTACK_API_KEY)
  }

  componentDidMount () {
    this.props.fetchSiteMaps({ site_id: this.props.site.get('id') })
  }

  uploadSiteMap () {
    this.client
      .pick(FILESTACK_OPTIONS)
      .then((res) => this.createSiteMap(res))
  }

  createSiteMap (res) {
    const file = res.filesUploaded[0]

    const siteMapParams = {
      site_id: this.props.site.get('id'),
      title: file.filename,
      url: file.url,
    }

    this.props.createSiteMap(siteMapParams)
  }

  render () {
    let siteMaps = undefined
    if (this.props.siteMaps && this.props.siteMaps.size > 0) {
      siteMaps = this.props.siteMaps.map((siteMap) => {
        return (<div key={siteMap.get('id')}>
          <Link
            to={`/app/sites/${this.props.site.get('id')}/details/site-maps/${siteMap.get('id')}`}>
            {siteMap.get('title')}
          </Link>
        </div>)
      })
    } else {
      siteMaps = <h4> No Site Maps Uploaded </h4>
    }

    return (
      <div className="site-maps">
        <div className="d-flex flex-row justify-content-between">
          <h2>Site Maps</h2>
          <Button
            onClick={this.uploadSiteMap}
            className='btn btn-default float-right'>
            New Site Map
          </Button>
        </div>

        <div className="site-map-list">
          {siteMaps}
        </div>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  siteMaps: store.get('siteMaps'),
})

const mapDispatchToProps = dispatch => ({
  fetchSiteMaps: filters => dispatch(fetchSiteMaps(filters)),
  createSiteMap: siteMapParams => dispatch(createSiteMap(siteMapParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteMapsList)
