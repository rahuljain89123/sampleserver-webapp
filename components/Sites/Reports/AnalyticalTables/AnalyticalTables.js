import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import download from 'downloadjs'

import {
  Field,
  reduxForm,
  formValueSelector,
  change,
} from 'redux-form/immutable'
import moment from 'moment'
import {
  Row,
  Col,
  Form,
  Input,
  Button,
} from 'reactstrap'
import {
  createAnalyticalTables,
} from 'actions/reports'
import {
  flashMessage,
} from 'actions/global'

import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';

import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'
import * as contouringFn from 'Sites/Reports/Shared/contouringFunctions'

import {
  fetchSubstances,
  fetchSubstanceGroups,
} from 'actions/substances'

import {
  fetchWells,
} from 'actions/wells'

import { fetchSiteMaps } from 'actions/siteMaps'
import { fetchSamples } from 'actions/samples'
import { fetchSampleDates } from 'actions/sampleValues'
import { fetchCriterias } from 'actions/criterias'
import { editSite } from 'actions/sites'

import { REPORTS_SUBSTANCE_IDS_TO_HIDE } from 'constants/database/substanceIds'
const FORM_NAME = 'AnalyticalTables'

function encodeQueryData (data) {
  const ret = []
  for (let d in data)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
  return ret.join('&')
}

function encodeData(data) {
  return Object.keys(data).map(key =>
    [key, data[key]].map(encodeURIComponent).join('=')).join('&')
}

class AnalyticalTables extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.swapIframe = this.swapIframe.bind(this)
    this.state = {}
  }

  componentDidMount () {
    this.props.fetchSamples({ site_id: this.props.site.get('id') })
    this.props.fetchSampleDates(this.props.site.get('id'))
    this.props.fetchCriterias({ state_id: this.props.site.get('state_id'), active: true })
    this.props.fetchSubstances()
    this.props.fetchSubstanceGroups()
    this.props.fetchWells({ site_id: this.props.site.get('id') })
    if (this.props.date_collected) {
      this.swapIframe()
    }
  }

  componentWillReceiveProps (nextProps) {
    const hasNecessaryProps = nextProps.date_collected

    const dateChanged = nextProps.date_collected !== this.props.date_collected ||
      nextProps.date_collected_range_end !== this.props.date_collected_range_end

    const siteMapChanged = !this.props.siteMapId || this.props.siteMapId !== nextProps.siteMapId

    const criteriaChanged = nextProps.criteria_id !== this.props.criteria_id

    if (hasNecessaryProps && (dateChanged || siteMapChanged || criteriaChanged)) { this.swapIframe(nextProps) }
  }

  onSubmit (formParams) {
    formParams = formParams.set('site_id', this.props.site.get('id'))
      .update('criteria_id', (id) => id ? parseInt(id) : -1)
      .update('sitemap_id', (id) => parseInt(id))
      .set('substance_ids', this.props.site.get('substance_ids'))

    this.props.createAnalyticalTables(formParams)
      .then((resp) => {
        console.log(resp)
        const x = new window.XMLHttpRequest()
        x.open('GET', `/backend${resp.path}`, true)
        x.responseType = 'blob'
        x.onload = function(e) { download(x.response, resp.filename, 'application/pdf') }
        x.send()
        this.props.flashMessage('success', 'Report Generated')
      })
      .catch(() => this.props.flashMessage('STANDARD_ERROR'))
  }

  addSubstance(value) {
    this.props.editSite(this.props.site.get('id'), {
      'substances': { 'add': [value], 'remove': []}
    })
  }

  removeSubstance(substanceId) {
    this.props.editSite(this.props.site.get('id'), {
      'substances': { 'add': [], 'remove': [substanceId] }
    })
  }

  substanceIdInDateRange(substanceId) {
    const { sampleDates, date_collected: t_start_date, date_collected_range_end: t_end_date } = this.props
    return contouringFn.substanceIdInDate(substanceId, sampleDates, t_start_date, t_end_date)
  }

  shouldShowSubstanceId (substanceId) {
    const substanceIds = this.props.site.get('substance_ids')

    if (REPORTS_SUBSTANCE_IDS_TO_HIDE.includes(substanceId)) { return false }

    return (!substanceIds.includes(substanceId) && this.substanceIdInDateRange(substanceId))
  }

  swapIframe (props) {
    if (!props) { props = this.props }
    const params = {
      site_id: parseInt(props.site.get('id')),
      date_collected: props.date_collected,
      criteria_id: props.criteria_id ? parseInt(props.criteria_id) : -1,
      substance_ids: props.site.get('substance_ids'),
    }
    if (props.date_collected_range_end) {
      params.date_collected_range_end = props.date_collected_range_end
    }
    const myiFrameUrl = `/api/v1/reports/preview-analytical-tables?${encodeQueryData(params)}`
    this.setState({ iframeUrl: myiFrameUrl })
  }

  render () {
    const {
      site,
      substances,
      sampleDates,
      substanceGroups,
      dates,
      criterias,
      handleSubmit,
    } =  this.props

    let substancesLabel = null
    let analyticalTablePreview = null
    let downloadReportButton = null
    let analyticalTablesForm = null
    let sidebarContent = null

    // Fill the form details
    const startDateOptions = contouringFn.startDateOptions(this.props.sampleDates, this.props.date_collected_range_end)
    const endDateOptions = contouringFn.endDateOptions(this.props.sampleDates, this.props.date_collected)
    const criteriaOptions = criterias.valueSeq().map((criteria) =>
      ({ value: criteria.get('id'), label: criteria.get('title') })).toJS()
    const groupedSubstances = substanceGroups.map((substanceGroup) =>
      substances.filter((substance) =>
        (substance.get('substance_group_id') === substanceGroup.get('id') &&
        this.shouldShowSubstanceId(substance.get('id')))
      )
    ).filter(substances => substances.size)
    const groupedSubstanceOptions = groupedSubstances.map((substances, substanceGroupId) =>
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
    const siteSubstances = site.get('substance_ids').map((id) => {
      if (!substances.size) { return null }
      return (<li key={id}>
        {substances.get(id).get('title')}
        <a href='#' onClick={(e) => this.removeSubstance(id)}> X </a>
      </li>)
    })
    const showSubstancesDropdown = (siteSubstances.size < 13 && !!groupedSubstanceOptions.length)
    if (siteSubstances.size || showSubstancesDropdown) { substancesLabel = <label htmlFor="">Substances</label> }

    // Create the iframe preview and button
    if (this.state.iframeUrl) {
      downloadReportButton = <Button color="primary" className="download-report-btn btn-lg btn-block"> Download Report </Button>
      analyticalTablePreview = (
        <div className="iframe-wrapper">
          <iframe ref="myIframe" src={this.state.iframeUrl} className="analytical-tables-preview" frameBorder="0" />
        </div>
      )
    }

    // Create the form
    analyticalTablesForm = (
      <Form onSubmit={handleSubmit(this.onSubmit)}>

        <Field
          props={{label: 'Start Date', placeholder: 'Select start date', location: 'sidebar'}}
          name='date_collected'
          id='date_collected'
          options={startDateOptions}
          component={SelectFormGroup}
        />

        <Field
          props={{label: 'End Date', placeholder: 'Select end date (optional)', location: 'sidebar'}}
          name='date_collected_range_end'
          id='date_collected_range_end'
          options={endDateOptions}
          component={SelectFormGroup}
        />

        <Field
          props={{label: 'Comparison Criteria', placeholder: ' ', location: 'sidebar'}}
          name='criteria_id'
          id='criteria_id'
          options={criteriaOptions}
          component={SelectFormGroup}
        />

        {substancesLabel}
        <ul className="substances-list">
          {siteSubstances}
        </ul>
        { showSubstancesDropdown &&
          <div className="form-group">
            <Select
              options={groupedSubstanceOptions}
              placeholder='Add substance...'
              onChange={(v) => this.addSubstance(v.value)}
            />
          </div>
        }
        { downloadReportButton }
      </Form>
    )

    // Create sidebar content
    if (this.props.wells && this.props.wells.size) {
      sidebarContent = analyticalTablesForm
    } else {
      sidebarContent = (
        <span>
          <Link to={`/app/sites/${this.props.site.get('id')}/setup/wells`}>Add wells to your site</Link> before using this page.
        </span>
      )
    }

    return (
      <div className='analytical-tables'>
        <div className='inner-sidebar'>
          <div className='sidebar-content'>
            {sidebarContent}
          </div>
        </div>
        <div className='fixed-content'>
          {analyticalTablePreview}
        </div>
      </div>
    )
  }
}

AnalyticalTables = reduxForm({form: FORM_NAME, destroyOnUnmount: false })(AnalyticalTables)

const selector = formValueSelector(FORM_NAME)
const mapStateToProps = (state, ownProps) => ({
  substances: state.get('substances'),
  substanceGroups: state.get('substanceGroups'),
  wells: state.get('wells'),
  criterias: state.get('criterias'),
  sampleDates: state.get('sampleDates').filter(sampleDate => sampleDate.get('site_id') === ownProps.site.get('id')),
  siteMaps: state.get('siteMaps').filter(siteMap => siteMap.get('site_id') === ownProps.site.get('id')),
  submittingReport: state.get('submittingReport'),

  siteMapId: selector(state, 'sitemap_id'),
  date_collected: selector(state, 'date_collected'),
  criteria_id: selector(state, 'criteria_id'),
  date_collected_range_end: selector(state, 'date_collected_range_end'),
})

const mapDispatchToProps = (dispatch) => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  createAnalyticalTables: (analyticalTableParams) => dispatch(createAnalyticalTables(analyticalTableParams)),
  fetchSubstances: () => dispatch(fetchSubstances()),
  fetchSubstanceGroups: () => dispatch(fetchSubstanceGroups()),
  fetchWells: (filters) => dispatch(fetchWells(filters)),
  fetchSiteMaps: filters => dispatch(fetchSiteMaps(filters)),
  fetchSamples: filters => dispatch(fetchSamples(filters)),
  fetchSampleDates: siteId => dispatch(fetchSampleDates(siteId)),
  fetchCriterias: filters => dispatch(fetchCriterias(filters)),

  editSite: (id, siteParams) => dispatch(editSite(id, siteParams))
})

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticalTables)
