
import React from 'react'
import { connect } from 'react-redux'

import {
  resizedImageUrl
} from 'helpers/filestack'

import {
  fetchSiteMap,
  fetchSiteMapWells,
  createSiteMapWell,
  setAddingSiteMapWell,
} from 'actions/siteMaps'

import {
  fetchWells
} from 'actions/wells'

import {
  flashMessage
} from 'actions/global'

import SiteMapImage from './SiteMapImage'

class SiteMap extends React.Component {
  constructor (props) {
    super(props)

    this.addSiteMapWell = this.addSiteMapWell.bind(this)
  }

  componentDidMount () {
    this.props.fetchSiteMap(this.props.siteMapId)
    this.props.fetchSiteMapWells({ site_map_id: this.props.siteMapId })
    this.props.fetchWells({ site_id: this.props.site.get('id') })
  }


  addSiteMapWell (evt) {
    const divOffsets = evt.target.getBoundingClientRect()

    const well = {
      xpos: evt.clientX - divOffsets.left,
      ypos: evt.clientY - divOffsets.top,
      well_id: 2423,
      site_map_id: this.props.siteMapId,
    }

    this.props.createSiteMapWell(well)
  }


  render () {
    const siteMap = this.props.siteMaps.get(this.props.siteMapId)
    if (!siteMap) { return null }

    const siteMapWells = this.props.siteMapWells.filter((smw) => (
      smw.get('site_map_id') === this.props.siteMapId &&
      this.props.wells.get(smw.get('well_id'))
    ))

    const wellNames = siteMapWells.map((smw) => {
      const well = this.props.wells.get(smw.get('well_id'))
      return <li className='well'>{well.get('title')}</li>
    })

    const imageUrl = resizedImageUrl(siteMap.get('url'), { width: 640, height: 640, fit: 'scale' })
    return (
      <div className="site-map">
        <h2> {siteMap.get('title')} </h2>
        <div className='d-flex'>
          <SiteMapImage
            imageUrl={imageUrl}
            siteMapWells={siteMapWells}
            addSiteMapWell={this.addSiteMapWell} />
          <ul className='well-names'>
            {wellNames}
          </ul>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (store, props) => ({
  siteMaps: store.get('siteMaps'),
  siteMapWells: store.get('siteMapWells'),
  addingSiteMapWell: store.get('addingSiteMapWell'),
  wells: store.get('wells'),
  siteMapId: parseInt(props.match.params.id, 10),
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, heading)),
  fetchSiteMap: (id) => dispatch(fetchSiteMap(id)),
  fetchSiteMapWells: (filters) => dispatch(fetchSiteMapWells(filters)),
  setAddingSiteMapWell: (adding) => dispatch(setAddingSiteMapWell(adding)),
  createSiteMapWell: (siteMapWellParams) => dispatch(createSiteMapWell(siteMapWellParams)),
  fetchWells: (filters) => dispatch(fetchWells(filters)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteMap)
