import React from 'react'
import { connect } from 'react-redux'
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
import { fetchSamples } from 'actions/samples'
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

const FORM_NAME = 'FreeProductForm'

class FreeProduct extends React.Component {
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
    this.props.fetchSubstances()
    this.props.fetchSubstanceGroups()
    this.props.fetchWells({ site_id: this.props.site.get('id') }).then(this.setSelectedWells)
    this.props.fetchSamples({ site_id: this.props.site.get('id') })
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
        substance_ids: [27, 28, 35],
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
      substance_ids: [27, 28, 35],
      wells: contouringFn.selectedWellsForSubmit(
        formParams.get('selectedWells'),
        this.props.groupedSampleValues,
        formParams.get('zeroWells')
      ),
      title_wildcard: formParams.get('title_wildcard'),
      remove_zero_contour: formParams.get('zero_line') === 'false',
    }

    this.props.createContour(params)
      .then((url) => window.location = url)
      .catch(() => this.props.flashMessage('danger', 'bad schema'))
  }

  processClickEvent (xpos, ypos) {
    const { siteMapWells, zeroWells } = this.props

    if (evt.button === 2) { contouringFn.addZeroWell(xpos, ypos, this, FORM_NAME) }
    contouringFn.processClick(xpos, ypos, siteMapWells, this.toggleWell, zeroWells, this, FORM_NAME)
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
    const { date, sampleDates, substanceIds } = this.props
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
      (gsvWell) => gsvWell.get('substance_sum')
    )
  }

  render () {
    const {
      handleSubmit,
      zeroWells,
      siteMapWells,
      siteMapId,
    } = this.props

    const siteMapOptions = this.props.siteMaps.valueSeq().map((siteMap) =>
      <option key={siteMap.get('id')} value={siteMap.get('id')}>{siteMap.get('title')}</option>
    )

    const startDateOptions = contouringFn.startDateOptions(this.props.sampleDates, this.props.date_collected_range_end)
    const endDateOptions   = contouringFn.endDateOptions(this.props.sampleDates, this.props.date_collected)

    const booleanOptions = [
      { value: 'true', title: 'ON' },
      { value: 'false', title: 'OFF' }
    ].map((bool, index) => <option key={index} value={bool.value}>{bool.title}</option>)

    const scaleOptions = ['Linear', 'Logarithmic'].map((opt, index) =>
      <option key={index} value={opt}>{opt}</option>
    )

    let siteMapComponent = null

    if (this.props.siteMapId) {
      const currentSiteMap = this.props.siteMaps.get(
        parseInt(this.props.siteMapId)
      )

      const allWells = contouringFn.allWells(siteMapWells, siteMapId, zeroWells)


      siteMapComponent = <SiteMapRenderer
        imageUrl={currentSiteMap.get('url')}
        wells={siteMapWells}
        onClick={this.processClickEvent}
        drawWellMarker={this.drawWellMarker}
        />
    }

    return (
      <div className='site-map'>
        <div className='inner-sidebar contouring-sidebar'>
          <h4> Configure </h4>
          <div className='sidebar-content'>
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
                props={{placeholder: 'Zero Line?', label: 'Zero Line', location: 'sidebar'}}
                name='zero_line'
                id='zero_line'
                options={booleanOptions}
                component={SelectFormGroup}
              />

              <Field
                props={{label: 'Title', location: 'sidebar'}}
                name='title_wildcard'
                id='title_wildcard'
                type='text'
                component={IndividualFormGroup}
              />

              <div className='centered-btn'>
                <Button
                  disabled={!this.props.groupedSampleValues.size}
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

FreeProduct = reduxForm({ form: FORM_NAME })(FreeProduct)

const selector = formValueSelector(FORM_NAME)

const mapStateToProps = (state, props) => ({
  siteMaps: state.get('siteMaps'),
  siteMapWells: state.get('siteMapWells'),
  substances: state.get('substances'),
  substanceGroups: state.get('substanceGroups'),
  wells: state.get('wells'),
  samples: state.get('samples'),
  sampleDates: state.get('sampleDates'),
  groupedSampleValues: state.get('groupedSampleValues'),
  siteMapId: selector(state, 'sitemap_id'),
  zeroWells: selector(state, 'zeroWells'),
  substanceIds: selector(state, 'substance_ids'),
  date_collected: selector(state, 'date_collected'),
  date_collected_range_end: selector(state, 'date_collected_range_end'),
  selectedWells: selector(state, 'selectedWells')
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),

  fetchSiteMaps: (filters) => dispatch(fetchSiteMaps(filters)),
  fetchSiteMap: (id) => dispatch(fetchSiteMap(id)),
  fetchSamples: filters => dispatch(fetchSamples(filters)),
  fetchGroupedSampleValues: params => dispatch(fetchGroupedSampleValues(params)),
  fetchSampleDates: siteId => dispatch(fetchSampleDates(siteId)),
  fetchSiteMapWells: (filters) => dispatch(fetchSiteMapWells(filters)),
  fetchSubstances: (filters) => dispatch(fetchSubstances(filters)),
  fetchSubstanceGroups: () => dispatch(fetchSubstanceGroups()),
  fetchWells: (filters) => dispatch(fetchWells(filters)),

  createContour: (contourParams) => dispatch(createContour(contourParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FreeProduct)
