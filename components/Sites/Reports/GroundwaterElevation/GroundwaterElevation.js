import React from 'react'
import { connect } from 'react-redux'
import download from 'downloadjs'

import {
  Field,
  FieldArray,
  reduxForm,
  formValueSelector,
  change,
} from 'redux-form/immutable'
import {
  Form,
  Input,
  Label,
  Row,
  Col,
  Button,
} from 'reactstrap'
import Immutable from 'immutable'
import moment from 'moment'

import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'
import IndividualFormGroup from 'SharedComponents/ReduxFormHelpers/IndividualFormGroup'
import SiteMapRenderer from 'SharedComponents/SiteMapRenderer'
import SelectSubstances from 'Sites/Reports/Shared/SelectSubstances'

import * as contouringFn from 'Sites/Reports/Shared/contouringFunctions'

import {
  fetchSiteMap,
  fetchSiteMaps,
  fetchSiteMapWells,
} from 'actions/siteMaps'

import {
  fetchWells
} from 'actions/wells'

import {
  fetchSubstances,
  fetchSubstanceGroups,
} from 'actions/substances'
import {
  fetchGroupedSampleValues,
  fetchSampleDates,
} from 'actions/sampleValues'

import {
  flashMessage
} from 'actions/global'
import { createContour } from 'actions/reports'

import {
  CHECKED,
  UNCHECKED
} from 'Sites/Reports/Shared/assets'

const WELL_MARKER_HEIGHT = 25
const WELL_MARKER_WIDTH = 100

const FORM_NAME = 'GroundwaterElevationForm'

class GroundwaterElevation extends React.Component {
  constructor (props) {
    super(props)
    this.drawWellMarker = this.drawWellMarker.bind(this)
    this.processClickEvent = this.processClickEvent.bind(this)
    this.toggleWell = this.toggleWell.bind(this)
    this.setSelectedWells = this.setSelectedWells.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    this.props.fetchSiteMaps({ site_id: this.props.site.get('id') })
      .then(() => this.props.dispatch(change(FORM_NAME, 'sitemap_id', this.props.siteMaps.first().get('id'))))
    this.props.fetchSubstances()
    this.props.fetchSubstanceGroups()
    this.props.fetchWells({ site_id: this.props.site.get('id') }).then(this.setSelectedWells)
    this.props.fetchSampleDates(this.props.site.get('id'))

    this.checkedImage = new Image()
    this.checkedImage.src = CHECKED
    this.uncheckedImage = new Image()
    this.uncheckedImage.src = UNCHECKED
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.siteMapId && nextProps.siteMapId !== this.props.siteMapId) {
      this.props.fetchSiteMapWells({site_map_id: nextProps.siteMapId })
    }

    const hasNecessaryProps = nextProps.siteMapId && nextProps.date_collected
    const dateChanged = nextProps.date_collected !== this.props.date_collected ||
      nextProps.date_collected_range_end !== this.props.date_collected_range_end
    const siteMapAdded = !this.props.siteMapId

      if (hasNecessaryProps && (dateChanged || siteMapAdded)) {
      let params = {
        date_collected: nextProps.date_collected,
        sitemap_id: parseInt(nextProps.siteMapId),
        substance_ids: [35],
        site_id: parseInt(nextProps.site.get('id')),
      }

      if (nextProps.date_collected_range_end) {
        params.date_collected_range_end = nextProps.date_collected_range_end
      }

      this.props.fetchGroupedSampleValues(params)
    }
  }

  onSubmit (formParams) {

    let params = {
      site_id: this.props.site.get('id'),
      date_collected: formParams.get('date_collected'),
      date_collected_range_end: formParams.get('date_collected_range_end'),
      sitemap_id: parseInt(formParams.get('sitemap_id')),
      groundwater_contours: true,
      substance_ids: [35],
      wells: contouringFn.selectedWellsForSubmit(
        formParams.get('selectedWells'),
        this.props.groupedSampleValues,
      ),
      title_wildcard: formParams.get('title_wildcard'),
      flow_lines: formParams.get('flow_lines') === 'true',
    }

    this.props.createContour(params)
      .then((url) => download(url, 'groundwater-contour-report.pdf', 'application/pdf'))

      .catch(() => this.props.flashMessage('danger', 'Sorry, there was an error.'))
  }

  processClickEvent (xpos, ypos, evt, scale) {
    const { siteMapWells } = this.props
    contouringFn.processClick(xpos, ypos, siteMapWells, this.toggleWell, scale)
  }

  setSelectedWells () {
    let tmpState = Immutable.Map()
    this.props.wells.forEach((well) => {
      tmpState = tmpState.set(well.get('id'), true)
    })

    this.props.dispatch(change(FORM_NAME, 'selectedWells', tmpState))
  }

  toggleWell (wellId) {
    this.props.dispatch(change(
      FORM_NAME,
      'selectedWells',
      this.props.selectedWells.set(wellId, !this.props.selectedWells.get(wellId))
    ))
  }

  shouldShowSubstanceId (substanceId) {
    const {
      date_collected,
      date_collected_range_end,
      sampleDates,
      substanceIds,
    } = this.props
    return contouringFn.substanceIdInDate(substanceId, sampleDates, date_collected, date_collected_range_end) &&
      ((substanceIds && !substanceIds.includes(substanceId.toString())) || !substanceIds)
  }

  drawWellMarker (well, ctx, loc) {
    contouringFn.drawWellMarker(
      well,
      ctx,
      loc,
      this.props,
      this.checkedImage,
      this.uncheckedImage,
      this.getGroundwaterElevationValue,
    )
  }

  getGroundwaterElevationValue (gsvWell) {
    if (!gsvWell.get('substances')) { return null }
    return parseFloat(gsvWell.get('top_of_casing')) - gsvWell.getIn(['substances', '35', 'substance_value'])
  }

  /**
   * Returns true if there are no selected wells on the contour map with a non-zero value
   */
  renderZeroError () {
    // Don't render the error if we haven't pulled any sample values
    if (!this.props.groupedSampleValues.size) { return false; }

    return this.props.siteMapWells.filter(smw =>
      smw.get('site_map_id') === parseInt(this.props.siteMapId) &&
      this.props.selectedWells.get(smw.get('well_id')) &&
      !!this.props.groupedSampleValues.get(smw.get('well_id').toString()).get('substance_sum')
    ).size === 0
  }

  render () {
    const {
      handleSubmit,
      siteMaps,
    } = this.props

    const siteMapOptions = siteMaps.valueSeq().map((siteMap) =>
      ({ value: siteMap.get('id'), label: siteMap.get('title') })).toJS()

    const startDateOptions = contouringFn.startDateOptions(this.props.sampleDates, this.props.date_collected_range_end)
    const endDateOptions   = contouringFn.endDateOptions(this.props.sampleDates, this.props.date_collected)

    const booleanOptions = [
      { value: 'true', label: 'ON' },
      { value: 'false', label: 'OFF' }
    ]

    let errorDisplay = null
    if (this.renderZeroError()) {
      errorDisplay = (
        <div className="alert alert-danger fade show" role="alert">
          Cannot create contours with all 0 values
        </div>
      )
    }

    const shouldDisableButton = !this.props.groupedSampleValues.size || this.renderZeroError() || this.props.submittingReport

    let siteMapComponent = null

    if (this.props.siteMapId) {
      const currentSiteMap = this.props.siteMaps.get(
        parseInt(this.props.siteMapId)
      )

      const siteMapWells = this.props.siteMapWells.filter((smw) =>
        smw.get('site_map_id') === parseInt(this.props.siteMapId)
      )

      siteMapComponent = <SiteMapRenderer
        imageUrl={currentSiteMap.get('url')}
        wells={siteMapWells}
        onClick={this.processClickEvent}
        drawWellMarker={this.drawWellMarker}
        />
    }

    return (
      <div className='site-map'>
        <div  className='inner-sidebar contouring-sidebar'>
          <div className='sidebar-content'>
          {errorDisplay}
          <Form className='contouring-form' onSubmit={handleSubmit(this.onSubmit)}>
            <Field
              props={{placeholder: 'Select Sitemap', label: 'Sitemap', location: 'sidebar'}}
              name='sitemap_id'
              id='sitemap_id'
              component={SelectFormGroup}
              options={siteMapOptions}
            />

            <Field
              props={{placeholder: 'Select Date', label: 'Start Date', location: 'sidebar'}}
              name='date_collected'
              id='date_collected'
              options={startDateOptions}
              component={SelectFormGroup}
            />

            <Field
              props={{placeholder: 'Select End Date (optional)', label: 'End Date', location: 'sidebar'}}
              name='date_collected_range_end'
              id='date_collected_range_end'
              options={endDateOptions}
              component={SelectFormGroup}
            />


            <Field
              props={{placeholder: 'Flow Lines?', label: 'Flow Lines', location: 'sidebar'}}
              name='flow_lines'
              id='flow_lines'
              options={booleanOptions}
              component={SelectFormGroup}
            />

            <Field
              props={{label: 'Title'}}
              name='title_wildcard'
              id='title_wildcard'
              type='text'
              component={IndividualFormGroup}
            />

            <div className='centered-btn'>
              <Button
                disabled={shouldDisableButton}
                className="download-report-btn btn-lg btn-block"
                color="primary"
              >Contour</Button>
            </div>
          </Form>
          </div>
        </div>
        <div className='site-map-content'>
          {siteMapComponent}
        </div>
      </div>
    )
  }
}

GroundwaterElevation = reduxForm({ form: FORM_NAME })(GroundwaterElevation)

const selector = formValueSelector(FORM_NAME)

const mapStateToProps = (state, ownProps) => ({
  siteMaps: state.get('siteMaps').filter(siteMap => siteMap.get('site_id') === ownProps.site.get('id')),
  siteMapWells: state.get('siteMapWells'),
  substances: state.get('substances'),
  substanceGroups: state.get('substanceGroups'),
  wells: state.get('wells').filter(well => well.get('site_id') === ownProps.site.get('id')),
  sampleDates: state.get('sampleDates').filter(sampleDate => sampleDate.get('site_id') === ownProps.site.get('id')),
  groupedSampleValues: state.get('groupedSampleValues'),
  submittingReport: state.get('submittingReport'),

  siteMapId: selector(state, 'sitemap_id'),
  substanceIds: selector(state, 'substance_ids'),
  date_collected: selector(state, 'date_collected'),
  date_collected_range_end: selector(state, 'date_collected_range_end'),
  selectedWells: selector(state, 'selectedWells')
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),

  fetchSiteMaps: (filters) => dispatch(fetchSiteMaps(filters)),
  fetchSiteMap: (id) => dispatch(fetchSiteMap(id)),
  fetchGroupedSampleValues: params => dispatch(fetchGroupedSampleValues(params)),
  fetchSampleDates: siteId => dispatch(fetchSampleDates(siteId)),
  fetchSiteMapWells: (filters) => dispatch(fetchSiteMapWells(filters)),
  fetchSubstances: (filters) => dispatch(fetchSubstances(filters)),
  fetchSubstanceGroups: () => dispatch(fetchSubstanceGroups()),
  fetchWells: (filters) => dispatch(fetchWells(filters)),

  createContour: (contourParams) => dispatch(createContour(contourParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GroundwaterElevation)
