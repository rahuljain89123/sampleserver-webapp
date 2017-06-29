import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

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
import {
  fetchGroupedSampleValues,
  clearGroupedSampleValues,
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

import { REPORTS_SUBSTANCE_IDS_TO_HIDE } from 'constants/database/substanceIds'

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

    const hasNecessaryProps = nextProps.substanceIds && nextProps.substanceIds.size && nextProps.siteMapId && nextProps.date_collected
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
    } else if (!hasNecessaryProps) {
      this.props.clearGroupedSampleValues()
    }
  }

  processClickEvent (xpos, ypos, evt, scale) {
    const { siteMapWells, zeroWells } = this.props
    if (evt.button === 2) { return contouringFn.addZeroWell(xpos, ypos, this, FORM_NAME) }
    contouringFn.processClick(xpos, ypos, siteMapWells, this.toggleWell, scale, zeroWells, this, FORM_NAME)
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
      .then((resp) => {
        console.log(resp)
        const x = new window.XMLHttpRequest()
        x.open('GET', `/backend${resp.path}`, true)
        x.responseType = 'blob'
        x.onload = function(e) { download(x.response, resp.filename, 'application/pdf') }
        x.send()
        this.props.flashMessage('success', 'Report Generated')
      })
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

    if (REPORTS_SUBSTANCE_IDS_TO_HIDE.includes(substanceId)) { return false }

    return contouringFn.substanceIdInDate(substanceId, sampleDates, date_collected, date_collected_range_end) &&
      ((substanceIds && !substanceIds.includes(substanceId)) || !substanceIds)
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
      zeroWells,
      siteMapWells,
      siteMapId,
      siteMaps,
      sampleDates,
      date_collected_range_end,
      date_collected,
      substanceGroups
    } = this.props

    const siteMapOptions = siteMaps.valueSeq().map((siteMap) =>
      ({ value: siteMap.get('id'), label: siteMap.get('title') })).toJS()

    const startDateOptions = contouringFn.startDateOptions(sampleDates, date_collected_range_end)
    const endDateOptions   = contouringFn.endDateOptions(sampleDates, date_collected, date_collected_range_end)

    const groupedSubstances = this.props.substanceGroups.map((substanceGroup) =>
      this.props.substances.filter((substance) => (
        substance.get('substance_group_id') === substanceGroup.get('id') &&
        this.shouldShowSubstanceId(substance.get('id'))
      ))
    ).filter(substances => substances.size)

    const substanceOptions = groupedSubstances.map((substances, substanceGroupId) =>
      ({
        label: substanceGroups.get(substanceGroupId).get('title'),
        options: substances.valueSeq()
          .map(substance => ({
            label: substance.get('title'),
            value: substance.get('id'),
          }))
          .toJS()
      }))
      .valueSeq()
      .toJS()

    const booleanOptions = [
      { value: 'true', label: 'ON' },
      { value: 'false', label: 'OFF' }
    ]

    const scaleOptions = ['Linear', 'Logarithmic'].map((opt) =>
      ({value : opt, label: opt }))

    let errorDisplay = null

    if (this.renderZeroError()) {
      errorDisplay = (
        <div className="alert alert-danger fade show" role="alert">
          Cannot create contours with all 0 values
        </div>
      )
    }

    const shouldDisableButton = !this.props.groupedSampleValues.size  || this.renderZeroError() || this.props.submittingReport

    let siteMapComponent = null

    if (this.props.siteMapId) {
      const currentSiteMap = this.props.siteMaps.get(
        parseInt(this.props.siteMapId)
      )

      const allWells = contouringFn.allWells(siteMapWells, siteMapId, zeroWells)

      siteMapComponent = (
        <SiteMapRenderer
          imageUrl={currentSiteMap.get('url')}
          wells={allWells}
          onClick={this.processClickEvent}
          drawWellMarker={this.drawWellMarker}
        />
      )
    }

    const contouringForm = (
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
          className='form-control'
          gridWidth={12}
          component={IndividualFormGroup}
        />

        <div className='centered-btn'>
          <Button  disabled={shouldDisableButton} color="primary" className="download-report-btn btn-lg btn-block">
            Generate Report
          </Button>
        </div>
      </Form>
    )

    // Create sidebar content, if the site doesn't have wells yet, give the user a link to add them.
    let sidebarContent = null
    if (this.props.siteMaps.size && this.props.wells && this.props.wells.size) {
      sidebarContent = contouringForm
    } else if (!this.props.wells || !this.props.wells.size) {
      sidebarContent = (
        <span>
          <Link to={`/app/sites/${this.props.site.get('id')}/setup/wells`}>Add wells to your site</Link> before using this page.
        </span>
      )
    } else {
      sidebarContent = (
        <span>
          <Link to={`/app/sites/${this.props.site.get('id')}/setup/site-maps/new`}>Upload a sitemap</Link> and place wells before using this feature.
        </span>
      )
    }

    return (
      <div className='site-map'>
      <div className='inner-sidebar contouring-sidebar'>
        <div className='sidebar-content'>
          {errorDisplay}
          {sidebarContent}
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
  wells: state.get('wells').filter(well => well.get('site_id') === ownProps.site.get('id')),
  sampleDates: state.get('sampleDates').filter(date => date.get('site_id') === ownProps.site.get('id')),
  groupedSampleValues: state.get('groupedSampleValues'),
  submittingReport: state.get('submittingReport'),

  zeroWells: selector(state, 'zeroWells'),
  siteMapId: selector(state, 'sitemap_id'),
  substanceIds: selector(state, 'substance_ids'),
  date_collected: selector(state, 'date_collected'),
  date_collected_range_end: selector(state, 'date_collected_range_end'),
  selectedWells: selector(state, 'selectedWells'),
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),

  fetchSiteMaps: (filters) => dispatch(fetchSiteMaps(filters)),
  fetchSiteMap: (id) => dispatch(fetchSiteMap(id)),
  fetchGroupedSampleValues: params => dispatch(fetchGroupedSampleValues(params)),
  clearGroupedSampleValues: () => dispatch(clearGroupedSampleValues()),
  fetchSampleDates: siteId => dispatch(fetchSampleDates(siteId)),
  fetchSiteMapWells: (filters) => dispatch(fetchSiteMapWells(filters)),
  fetchSubstances: (filters) => dispatch(fetchSubstances(filters)),
  fetchSubstanceGroups: () => dispatch(fetchSubstanceGroups()),
  fetchWells: (filters) => dispatch(fetchWells(filters)),

  createContour: (contourParams) => dispatch(createContour(contourParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IsochemicalContours)
