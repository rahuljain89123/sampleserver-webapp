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
      this.props.fetchSiteMapWells({sitemap_id: nextProps.siteMapId })
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
    const selectedWells = formParams.get('selectedWells')
      .filter(selected => selected)
      .filter((selected, well_id) =>
        this.getGroundwaterElevationValue(this.props.groupedSampleValues.get(well_id.toString()))
      )

    let params = {
      site_id: this.props.site.get('id'),
      date_collected: formParams.get('date_collected'),
      date_collected_range_end: formParams.get('date_collected_range_end'),
      sitemap_id: parseInt(formParams.get('sitemap_id')),
      groundwater_contours: true,
      substance_ids: [35],
      wells: selectedWells.map((selected, well_id) => {
        const gsvWell = this.props.groupedSampleValues.get(well_id.toString())
        return {
          well_id: well_id,
          xpos: gsvWell.get('xpos'),
          ypos: gsvWell.get('ypos'),
          substance_sum: gsvWell.get('substance_sum'),
        }
      }).valueSeq(),
      title_wildcard: formParams.get('title_wildcard'),
      flow_lines: formParams.get('flow_lines') === 'true',
    }

    this.props.createContour(params)
      .then(() => this.props.flashMessage('success', 'good schema'))
      .catch(() => this.props.flashMessage('danger', 'bad schema'))
  }

  processClickEvent (xpos, ypos) {
    const { siteMapWells } = this.props
    contouringFn.processClick(xpos, ypos, siteMapWells, this.toggleWell)
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

  render () {
    const { handleSubmit } = this.props
    const siteMapOptions = this.props.siteMaps.valueSeq().map((siteMap) =>
      <option key={siteMap.get('id')} value={siteMap.get('id')}>{siteMap.get('title')}</option>
    )

    const dateOptions = this.props.sampleDates.valueSeq().map((date, i) =>
      <option key={date.get('id')}>{date.get('date_collected')}</option>)


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
      <Row>
      <Col sm={3} className='contouring-sidebar'>
        <h4 > Configure </h4>
        <Form className='contouring-form' onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            props={{placeholder: 'Sitemap'}}
            name='sitemap_id'
            id='sitemap_id'
            component={SelectFormGroup}
            options={siteMapOptions}
          />

          <Field
            props={{placeholder: 'Select Date'}}
            name='date_collected'
            id='date_collected'
            options={dateOptions}
            component={SelectFormGroup}
          />

          <Field
            props={{placeholder: 'Select End Date (optional)'}}
            name='date_collected_range_end'
            id='date_collected_range_end'
            options={dateOptions}
            component={SelectFormGroup}
          />


          <Field
            props={{placeholder: 'Flow Lines?'}}
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
              disabled={!this.props.groupedSampleValues.size}
              color="primary"
            >Contour</Button>
          </div>
        </Form>
      </Col>
      <Col sm={8}>
        {siteMapComponent}
      </Col>
    </Row>)
  }
}

GroundwaterElevation = reduxForm({ form: FORM_NAME })(GroundwaterElevation)

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

export default connect(mapStateToProps, mapDispatchToProps)(GroundwaterElevation)
