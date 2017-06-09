import React from 'react'
import { connect } from 'react-redux'
import download from 'downloadjs'

import {
  Field,
  FieldArray,
  reduxForm,
  formValueSelector,
  change,
  registerField,
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

const FORM_NAME = 'IsochemicalContoursForm'

class IsochemicalContours extends React.Component {
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
    this.props.fetchSamples({ site_id: this.props.site.get('id') })
    this.props.fetchSampleDates(this.props.site.get('id'))

    this.props.dispatch(registerField(FORM_NAME, 'zeroWells', 'FieldArray'))

    this.checkedImage = new Image()
    this.checkedImage.src = CHECKED
    this.uncheckedImage = new Image()
    this.uncheckedImage.src = UNCHECKED
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.siteMapId && nextProps.siteMapId !== this.props.siteMapId) {
      this.props.fetchSiteMapWells({site_map_id: nextProps.siteMapId })
    }

    const hasNecessaryProps = nextProps.substanceIds && nextProps.siteMapId && nextProps.date_collected
    const substanceIdsChanged = nextProps.substanceIds && !nextProps.substanceIds.equals(this.props.substanceIds)
    const dateChanged = nextProps.date_collected !== this.props.date_collected ||
      nextProps.date_collected_range_end !== this.props.date_collected_range_end
    const siteMapAdded = !this.props.siteMapId

    if (hasNecessaryProps && (substanceIdsChanged || dateChanged || siteMapAdded)) {
      let params = {
        date_collected: nextProps.date_collected,
        sitemap_id: parseInt(nextProps.siteMapId),
        substance_ids: nextProps.substanceIds.map((id) => parseInt(id)),
        site_id: parseInt(nextProps.site.get('id')),
      }

      if (nextProps.date_collected_range_end) {
        params.date_collected_range_end = nextProps.date_collected_range_end
      }

      this.props.fetchGroupedSampleValues(params)
    }
  }

  processClickEvent (xpos, ypos, evt) {
    const { siteMapWells, zeroWells } = this.props
    if (evt.button === 2) { return contouringFn.addZeroWell(xpos, ypos, this, FORM_NAME) }
    contouringFn.processClick(xpos, ypos, siteMapWells, this.toggleWell, zeroWells, this, FORM_NAME)
  }

  onSubmit (formParams) {
    let params = {
      site_id: this.props.site.get('id'),
      date_collected: formParams.get('date_collected'),
      date_collected_range_end: formParams.get('date_collected_range_end'),
      sitemap_id: parseInt(formParams.get('sitemap_id')),
      substance_ids: formParams.get('substance_ids'),
      wells: contouringFn.selectedWellsForSubmit(
        formParams.get('selectedWells'),
        this.props.groupedSampleValues,
        formParams.get('zeroWells')
      ),
      title_wildcard: formParams.get('title_wildcard'),
      remove_zero_contour: formParams.get('zero_line') === 'false',
      logarithmic_contours: formParams.get('scale') === 'Logarithmic',
      heatmap: formParams.get('heatmap') === 'true'
    }

    this.props.createContour(params)
      .then((url) => download(url, 'isochemical-contour-report.pdf', 'application/pdf'))
      .catch(() => this.props.flashMessage('danger', 'Sorry, there was an error.'))
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
    // const dateOptions = this.props.sampleDates.valueSeq().map((date, i) =>
    //   <option key={date.get('id')}>{date.get('date_collected')}</option>)

    const groupedSubstances = this.props.substanceGroups.map((substanceGroup) =>
      this.props.substances.filter((substance) => (
        substance.get('substance_group_id') === substanceGroup.get('id') &&
        this.shouldShowSubstanceId(substance.get('id'))
      ))
    ).filter(substances => substances.size)

    const substanceOptions = groupedSubstances.map((substances, substanceGroupId) =>
      <optgroup key={substanceGroupId} label={this.props.substanceGroups.get(substanceGroupId).get('title')}>
        {substances.valueSeq().map(substance => {
          return (<option key={substance.get('id')} value={substance.get('id')}>{substance.get('title')}</option>)
        })}
      </optgroup>
    ).filter((substanceGroup) => substanceGroup.props.children.size).valueSeq()

    const booleanOptions = [
      { value: 'true', title: 'ON' },
      { value: 'false', title: 'OFF' }
    ].map((bool, index) => <option key={index} value={bool.value}>{bool.title}</option>)

    const scaleOptions = ['Linear', 'Logarithmic'].map((opt, index) =>
      <option key={index} value={opt}>{opt}</option>
    )

    const shouldDisableButton = !this.props.groupedSampleValues.size || this.props.submittingReport

    let siteMapComponent = null

    if (this.props.siteMapId) {
      const currentSiteMap = this.props.siteMaps.get(
        parseInt(this.props.siteMapId)
      )

      const allWells = contouringFn.allWells(siteMapWells, siteMapId, zeroWells)

      siteMapComponent = <SiteMapRenderer
        imageUrl={currentSiteMap.get('url')}
        wells={allWells}
        onClick={this.processClickEvent}
        drawWellMarker={this.drawWellMarker}
        />
    }

    return (
      <div className='site-map'>
      <div className='inner-sidebar contouring-sidebar'>
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

          <label htmlFor="">Substances</label>
          <FieldArray
            name='substance_ids'
            id='substance_ids'
            component={SelectSubstances}
            options={substanceOptions}
            substances={this.props.substances}
          />

          <Field
            props={{placeholder: 'Zero Line?', label: 'Zero Line', location: 'sidebar'}}
            name='zero_line'
            id='zero_line'
            options={booleanOptions}
            component={SelectFormGroup}
          />

          <Field
            props={{placeholder: 'Heatmap?', label: 'Heatmap', location: 'sidebar'}}
            name='heatmap'
            id='heatmap'
            options={booleanOptions}
            component={SelectFormGroup}
          />

          <Field
            props={{placeholder: 'Scale', label: 'Scale', location: 'sidebar'}}
            name='scale'
            id='scale'
            options={scaleOptions}
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
            <Button  disabled={shouldDisableButton} color="primary" className="download-report-btn btn-lg btn-block">
              Generate Report
            </Button>
          </div>
        </Form>
        </div>
      </div>
      <div className='site-map-content'>
        {siteMapComponent}
      </div>
    </div>)
  }
}

IsochemicalContours = reduxForm({ form: FORM_NAME })(IsochemicalContours)

const selector = formValueSelector(FORM_NAME)

const mapStateToProps = (state, ownProps) => ({
  siteMaps: state.get('siteMaps').filter(siteMap => siteMap.get('site_id') === ownProps.site.get('id')),
  siteMapWells: state.get('siteMapWells'),
  substances: state.get('substances'),
  substanceGroups: state.get('substanceGroups'),
  wells: state.get('wells'),
  samples: state.get('samples'),
  sampleDates: state.get('sampleDates'),
  groupedSampleValues: state.get('groupedSampleValues'),
  submittingReport: state.get('submittingReport'),

  zeroWells: selector(state, 'zeroWells'),
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

export default connect(mapStateToProps, mapDispatchToProps)(IsochemicalContours)
