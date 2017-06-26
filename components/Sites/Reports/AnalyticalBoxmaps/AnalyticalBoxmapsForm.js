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
  createAnalyticalBoxmap,
} from 'actions/reports'
import {
  flashMessage,
} from 'actions/global'

import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';

import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'
import SiteMapRenderer from 'SharedComponents/SiteMapRenderer'
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

const FORM_NAME = 'AnalyticalBoxmapsForm'

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

class AnalyticalBoxmapsForm extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.processClickEvent = this.processClickEvent.bind(this)
    this.swapIframe = this.swapIframe.bind(this)

    this.state = { boxmapsUrl: null, iframeUrl: null, scale: 1 }
  }

  componentDidMount () {

    this.props.fetchSiteMaps({ site_id: this.props.site.get('id') })
      .then(() => {
        if (!this.props.siteMapId || !this.props.siteMaps.get(parseInt(this.props.siteMapId))) {
          this.props.dispatch(change(FORM_NAME, 'sitemap_id', this.props.siteMaps.first().size ? this.props.siteMaps.first().get('id') : null))
        }
      })
    this.props.fetchSamples({ site_id: this.props.site.get('id') })
    this.props.fetchSampleDates(this.props.site.get('id'))
    this.props.fetchCriterias({ state_id: this.props.site.get('state_id'), active: true })

    this.props.fetchSubstances()
    this.props.fetchSubstanceGroups()
    this.props.fetchWells({ site_id: this.props.site.get('id') })
    if (this.props.date_collected && this.props.siteMapId) {
      this.swapIframe()
    }
  }

  componentWillReceiveProps (nextProps) {
    const hasNecessaryProps = nextProps.siteMapId && nextProps.date_collected

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

    this.props.createAnalyticalBoxmap(formParams)
      .then((fileBlob) => {
        this.props.flashMessage('success', 'Report Generated')
        download(fileBlob, 'boxmaps-report.pdf', 'application/pdf')
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

    return (!substanceIds.includes(substanceId) && this.substanceIdInDateRange(substanceId))
  }

  processClickEvent (xpos, ypos) {
    return false
  }

  swapIframe (props) {
    if (!props) { props = this.props }
    const params = {
      site_id: parseInt(props.site.get('id')),
      sitemap_id: parseInt(props.siteMapId),
      date_collected: props.date_collected,
      criteria_id: props.criteria_id ? parseInt(props.criteria_id) : -1,
      substance_ids: props.site.get('substance_ids'),
    }
    if (props.date_collected_range_end) {
      params.date_collected_range_end = props.date_collected_range_end
    }

    const myiFrameUrl = `/api/v1/reports/preview-analytical-boxmap?${encodeQueryData(params)}`
    this.setState({ iframeUrl: myiFrameUrl })
  }

  scaleBy (increment) {
    if (this.state.scale + increment < 0.2) { return } //don't decrement scale below 0
    this.setState((prevState) => {
      const newScale = prevState.scale + increment
      return {
        scale: newScale,
      }
    })
  }

  render () {
    const {
      site,
      siteMaps,
      substances,
      sampleDates,
      substanceGroups,
      dates,
      criterias,
      handleSubmit,
    } =  this.props

    const siteMapOptions = siteMaps.valueSeq().map((siteMap) =>
      ({ value: siteMap.get('id'), label: siteMap.get('title') })).toJS()

    const startDateOptions = contouringFn.startDateOptions(this.props.sampleDates, this.props.date_collected_range_end)
    const endDateOptions   = contouringFn.endDateOptions(this.props.sampleDates, this.props.date_collected)

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

    let substancesLabel = null

    if (siteSubstances.size || showSubstancesDropdown) { substancesLabel =  <label htmlFor="">Substances</label> }

    let boxmapsPreview = null
    let boxmapsButton = null
    if (this.props.siteMapId) {
      const currentSiteMap = this.props.siteMaps.get(parseInt(this.props.siteMapId))
      const boxmapStyle = {
        height: '100%',
        width: '100%',
      }
      if (currentSiteMap) {
        const iframeStyle = {
          height: (currentSiteMap.get('height') * currentSiteMap.get('scale')) / this.state.scale,
          width: (currentSiteMap.get('width') * currentSiteMap.get('scale')) / this.state.scale,
          zoom: this.state.scale,
          MozTransform: `scale(${this.state.scale})`,
          MozTransformOrigin: `${0}px ${0}px`,
          OTransform: `scale(${this.state.scale})`,
          OTransformOrigin: `${0}px ${0}px`,
          WebkitTransform: `scale(${this.state.scale})`,
          WebkitTransformOrigin: `${0}px ${0}px`,
          position: 'absolute',
        }
        if (this.state.iframeUrl) {
          boxmapsButton = <Button color="primary" className="download-report-btn btn-lg btn-block"> Download Report </Button>
          boxmapsPreview = (
            <div className="boxmap-iframe-wrapper">
              <div className="zoom-controls">
                <i className="material-icons" onClick={(e) => this.scaleBy(0.2)}>add</i>
                <div className="zoom-level">{parseInt(this.state.scale * 100)}%</div>
                <i className="material-icons" onClick={(e) => this.scaleBy(-0.2)}>remove</i>
              </div>
              <div className="iframe-wrapper" style={boxmapStyle}>
                <iframe ref="myIframe" src={this.state.iframeUrl} className="boxmaps-preview" frameBorder="0" style={iframeStyle} />
              </div>
            </div>
          )
        } else {
          const currentSiteMap = this.props.siteMaps.get(parseInt(this.props.siteMapId))
          if (currentSiteMap) {
            boxmapsPreview = <SiteMapRenderer
              imageUrl={currentSiteMap.get('url')}

              onClick={this.processClickEvent}
              drawWellMarker={this.drawWellMarker}
              />
          }
        }
      }
    }

    let boxmapsForm = null
    boxmapsForm = (
      <Form onSubmit={handleSubmit(this.onSubmit)}>
        <Field
          props={{label: 'Site Map', placeholder: 'Select Site Map', location: 'sidebar'}}
          name='sitemap_id'
          id='sitemap_id'
          options={siteMapOptions}
          component={SelectFormGroup}
        />

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

        { boxmapsButton }
      </Form>
    )

    const currentSiteMap = this.props.siteMaps.get(parseInt(this.props.siteMapId))
    let sidebarContent = null

    if (currentSiteMap && this.props.wells && this.props.wells.size) {
      sidebarContent = boxmapsForm
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
      <div className='site-map analytical-boxmaps'>
        <div className='inner-sidebar'>
          <div className='sidebar-content'>
            {sidebarContent}
          </div>
        </div>
        <div className='site-map-content'>
          {boxmapsPreview}
        </div>
      </div>
    )
  }
}

AnalyticalBoxmapsForm = reduxForm({form: FORM_NAME, destroyOnUnmount: false })(AnalyticalBoxmapsForm)

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
  createAnalyticalBoxmap: (boxmapsParams) => dispatch(createAnalyticalBoxmap(boxmapsParams)),
  fetchSubstances: () => dispatch(fetchSubstances()),
  fetchSubstanceGroups: () => dispatch(fetchSubstanceGroups()),
  fetchWells: (filters) => dispatch(fetchWells(filters)),
  fetchSiteMaps: filters => dispatch(fetchSiteMaps(filters)),
  fetchSamples: filters => dispatch(fetchSamples(filters)),
  fetchSampleDates: siteId => dispatch(fetchSampleDates(siteId)),
  fetchCriterias: filters => dispatch(fetchCriterias(filters)),

  editSite: (id, siteParams) => dispatch(editSite(id, siteParams))
})

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticalBoxmapsForm)
