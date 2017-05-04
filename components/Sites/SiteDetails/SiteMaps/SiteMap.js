
import React from 'react'
import { connect } from 'react-redux'

import {
  fetchSiteMap,
  fetchSiteMapWells,
  createSiteMapWell,
  setAddingSiteMapWell,
  deleteSiteMapWell,
} from 'actions/siteMaps'

import {
  fetchWells
} from 'actions/wells'

import {
  flashMessage
} from 'actions/global'

import SiteMapImage from './SiteMapImage'
import SiteMapWellForm from './SiteMapWellForm'

class SiteMap extends React.Component {
  constructor (props) {
    super(props)

    this.addSiteMapWell = this.addSiteMapWell.bind(this)
    this.createSiteMapWell = this.createSiteMapWell.bind(this)
  }

  componentDidMount () {
    this.props.fetchSiteMap(this.props.siteMapId)
    this.props.fetchSiteMapWells({ site_map_id: this.props.siteMapId })
    this.props.fetchWells({ site_id: this.props.site.get('id') })
  }

  addSiteMapWell (xpos, ypos) {
    const well = {
      xpos,
      ypos,
      site_map_id: this.props.siteMapId,
    }

    this.props.setAddingSiteMapWell(well)
  }

  createSiteMapWell (wellParams) {
    this.props.createSiteMapWell(wellParams)
    .then(this.props.setAddingSiteMapWell(null))
  }

  deleteSiteMapWell (siteMapWellId) {
    this.props.deleteSiteMapWell(siteMapWellId)
  }

  render () {
    const siteMap = this.props.siteMaps.get(this.props.siteMapId)
    if (!siteMap) { return null }

    const siteMapWells = this.props.siteMapWells.filter((smw) => (
      smw.get('site_map_id') === this.props.siteMapId &&
      this.props.wells.get(smw.get('well_id'))
    ))

    const markedWellIds = siteMapWells.map((smw) => (smw.get('well_id'))).valueSeq()

    const unmarkedWells = this.props.wells
      .filter((well) => (!markedWellIds.contains(well.get('id'))))
      .valueSeq()

    const wellNames = siteMapWells.valueSeq().map((smw) => {
      const well = this.props.wells.get(smw.get('well_id'))
      return (
        <li key={smw.get('id')} className='well'>
          {well.get('title')}
          <a href='#' onClick={(e) => this.props.deleteSiteMapWell(smw.get('id'))}> x </a>
        </li>)
    })

    return (
      <div className="site-map">
        <h2> {siteMap.get('title')} </h2>
        <div className='d-flex'>

          <SiteMapImage
            imageUrl={siteMap.get('url')}
            siteMapWells={siteMapWells}
            addingSiteMapWell={this.props.addingSiteMapWell}
            addSiteMapWell={this.addSiteMapWell} />
          <ul className='well-names'>
            {wellNames}
          </ul>

          { this.props.addingSiteMapWell &&
            <SiteMapWellForm
              initialValues={this.props.addingSiteMapWell}
              onSubmit={this.createSiteMapWell}
              wells={unmarkedWells} />
          }
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
  deleteSiteMapWell: (id) => dispatch(deleteSiteMapWell(id)),

  fetchWells: (filters) => dispatch(fetchWells(filters)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteMap)
