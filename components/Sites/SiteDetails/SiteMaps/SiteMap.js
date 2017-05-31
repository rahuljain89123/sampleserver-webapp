
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

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
  flashMessage,
  setHeaderInfo
} from 'actions/global'

import SiteMapImage from './SiteMapImage'
import SiteMapWellForm from './SiteMapWellForm'

class SiteMap extends React.Component {
  constructor (props) {
    super(props)

    this.addSiteMapWell = this.addSiteMapWell.bind(this)
    this.createSiteMapWell = this.createSiteMapWell.bind(this)
    this._handleKeyDown = this._handleKeyDown.bind(this)
    this.props.setHeaderInfo(
      'Edit Sitemap',
    )
  }

  componentDidMount () {
    this.props.fetchSiteMap(this.props.siteMapId)
    this.props.fetchSiteMapWells({ site_map_id: this.props.siteMapId })
    this.props.fetchWells({ site_id: this.props.site.get('id') })
    document.addEventListener("keydown", this._handleKeyDown);
  }

  componentWillUnmount () {
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  /**
   * When escape is pressed, clear the sitemap well form
   */
  _handleKeyDown (evt) {
    switch (event.keyCode) {
      case 27: //Escape Key
        this.cancelAddingSiteMapWell()
        break;
      default:
        break;
    }
  }

  /**
   * Triggered when a user clicks on the sitemap
   * Displays the Well form so they can mark a well on the map
   */
  addSiteMapWell (xpos, ypos) {
    if (!this.getUnmarkedWells().size) {
      return this.props.setAddingSiteMapWell(null)
    }

    const well = {
      xpos,
      ypos,
      site_map_id: this.props.siteMapId,
    }

    this.props.setAddingSiteMapWell(well)
  }

  /**
   * Cancels the adding of the sitemap well
   */
  cancelAddingSiteMapWell () {
    this.props.setAddingSiteMapWell(null)
  }

  /**
   * Called on form submit,
   * makes a request to the database to add the well marker
   */
  createSiteMapWell (wellParams) {
    this.props.createSiteMapWell(wellParams)
    .then(() => {
      this.props.flashMessage('success', 'Well Marker successfully saved.')
      this.props.setAddingSiteMapWell(null)
    })
    .catch(() => this.props.flashMessage('STANDARD_ERROR'))
  }

  /**
   * Called on form submit,
   * makes a request to the database to delete a well marker
   */
  deleteSiteMapWell (siteMapWellId) {
    this.props.deleteSiteMapWell(siteMapWellId)
    .then(() => this.props.flashMessage('success', 'Well Marker successfully deleted.'))
    .catch(() => this.props.flashMessage('STANDARD_ERROR'))
  }

  /**
   * @return {Immutable.Map} Sitemap Well markers corresponding to the current sitemap
   */
  siteMapWells () {
    return this.props.siteMapWells.filter((smw) => (
      smw.get('site_map_id') === this.props.siteMapId &&
      this.props.wells.get(smw.get('well_id'))
    ))
  }

  /**
   * @param siteMapWells {Immutable.Map} Map of sitemap well markers
   * @return {Indexed.Seq<Integer>} List of wells that have been marked (by id)
   */
  markedWellIds (siteMapWells) {
    return siteMapWells.map(smw => smw.get('well_id'))
      .valueSeq()
  }

  /**
   * @param markedWellIds {Indexed.Seq<Integer>}
   * @return {Indexed.Seq} List of unmarked wells
   */
  unmarkedWells (markedWellIds) {
    return this.props.wells
      .filter((well) => (!markedWellIds.contains(well.get('id'))))
      .valueSeq()
  }

  getUnmarkedWells () {
    return this.unmarkedWells(this.markedWellIds(this.siteMapWells()))
  }

  render () {
    const siteMap = this.props.siteMaps.get(this.props.siteMapId)
    if (!siteMap) { return null }

    const siteMapWells = this.siteMapWells()
    const markedWellIds = this.markedWellIds(siteMapWells)
    const unmarkedWells = this.unmarkedWells(markedWellIds)

    const wellNames = siteMapWells.valueSeq().map((smw) => {
      const well = this.props.wells.get(smw.get('well_id'))
      return (
        <li key={smw.get('id')} className='well'>
          <span>{well.get('title')}</span>
          <a href='#' className="remove-well-marker" onClick={(e) => this.deleteSiteMapWell(smw.get('id'))}>
            <i className="material-icons warning">remove_circle_outline</i>
          </a>
        </li>)
    })

    let siteMapWellForm = null
    let markWellsMessage = null

    if (this.props.addingSiteMapWell) {
      siteMapWellForm = (<SiteMapWellForm
        initialValues={this.props.addingSiteMapWell}
        onSubmit={this.createSiteMapWell}
        wells={unmarkedWells} />)
    }

    if (!this.props.wells || !this.props.wells.size) {
      markWellsMessage = (
        <div>
          <p><Link
              to={`/app/sites/${this.props.site.get('id')}/details/wells`}>
              Add wells to your site
            </Link> before using this page.</p>
          <p>After adding wells you will be able to mark their location on the sitemap.</p>
        </div>
      )
    } else {
      markWellsMessage = <i>Click any location on the sitemap to place a well.</i>
    }

    return (
      <div className="site-map">
        <div className="inner-sidebar">
          <div className="sidebar-content">
            <h2> {siteMap.get('title')} </h2>
            {markWellsMessage}
            <ul className='well-names list-group'>
              {wellNames}
            </ul>
          </div>
        </div>

        <div className="site-map-content">

          <SiteMapImage
            imageUrl={siteMap.get('url')}
            siteMapWells={siteMapWells}
            wells={this.props.wells}
            addingSiteMapWell={this.props.addingSiteMapWell}
            addSiteMapWell={this.addSiteMapWell} />

          {siteMapWellForm}
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
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),

  fetchSiteMap: (id) => dispatch(fetchSiteMap(id)),

  fetchSiteMapWells: (filters) => dispatch(fetchSiteMapWells(filters)),
  setAddingSiteMapWell: (adding) => dispatch(setAddingSiteMapWell(adding)),
  createSiteMapWell: (siteMapWellParams) => dispatch(createSiteMapWell(siteMapWellParams)),
  deleteSiteMapWell: (id) => dispatch(deleteSiteMapWell(id)),

  fetchWells: (filters) => dispatch(fetchWells(filters)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteMap)
