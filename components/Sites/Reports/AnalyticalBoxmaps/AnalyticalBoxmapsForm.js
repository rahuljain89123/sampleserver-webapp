import React from 'react'
import { connect } from 'react-redux'
import {
  Field,
  reduxForm,
  formValueSelector,
} from 'redux-form/immutable'
import moment from 'moment'
import {
  Form,
  Input,
  Button,
} from 'reactstrap'
import { createAnalyticalBoxmaps } from 'actions/reports'
import {
  flashMessage
} from 'actions/global'
import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'
import * as contouringFn from 'Sites/Reports/Shared/contouringFunctions'

import {
  fetchSubstances,
  fetchSubstanceGroups,
} from 'actions/substances'
import { fetchSiteMaps } from 'actions/siteMaps'
import { fetchSamples } from 'actions/samples'
import { fetchSampleDates } from 'actions/sampleValues'
import { fetchCriterias } from 'actions/criterias'
import { editSite } from 'actions/sites'

class AnalyticalBoxmapsForm extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }
  componentDidMount () {
    this.props.fetchSiteMaps({ site_id: this.props.site.get('id') })
    this.props.fetchSamples({ site_id: this.props.site.get('id') })
    this.props.fetchSampleDates(this.props.site.get('id'))
    this.props.fetchCriterias({ state_id: this.props.site.get('state_id'), active: true })
    this.props.fetchSubstances()
    this.props.fetchSubstanceGroups()
  }

  onSubmit (formParams) {
    formParams = formParams.set('site_id', this.props.site.get('id'))
      .update('criteria_id', (id) => parseInt(id))
      .update('sitemap_id', (id) => parseInt(id))
      .set('substance_ids', this.props.site.get('substance_ids'))

    this.props.createAnalyticalBoxmaps(formParams)
      .then((url) => {
        this.props.flashMessage('success', 'good schema')
        //window.location = url
      })
      .catch(() => this.props.flashMessage('STANDARD_ERROR'))
  }

  addSubstance(evt) {
    this.props.editSite(this.props.site.get('id'), {
      'substances': { 'add': [evt.target.value], 'remove': []}
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
      <option key={siteMap.get('id')} value={siteMap.get('id')}>{siteMap.get('title')}</option>)

    const startDateOptions = contouringFn.startDateOptions(this.props.sampleDates, this.props.date_collected_range_end)
    const endDateOptions   = contouringFn.endDateOptions(this.props.sampleDates, this.props.date_collected)

    const dateOptions = sampleDates.valueSeq().map((date, i) =>
      <option key={date.get('id')} value={date.get('date_collected')}>{date.get('date_collected')}</option>)

    const criteriaOptions = criterias.valueSeq().map((criteria) =>
      <option key={criteria.get('id')} value={criteria.get('id')}>{criteria.get('title')}</option>)

    const groupedSubstances = substanceGroups.map((substanceGroup) =>
      substances.filter((substance) =>
        (substance.get('substance_group_id') === substanceGroup.get('id') &&
        this.shouldShowSubstanceId(substance.get('id')))
      )
    ).filter(substances => substances.size)

    const groupedSubstanceOptions = groupedSubstances.map((substances, substanceGroupId) =>
      <optgroup key={substanceGroupId} label={substanceGroups.get(substanceGroupId).get('title')}>
        {substances.valueSeq().map(substance => {
          return (<option key={substance.get('id')} value={substance.get('id')}>{substance.get('title')}</option>)
        })}
      </optgroup>
    ).valueSeq()


    const siteSubstances = site.get('substance_ids').map((id) => {
      if (!substances.size) { return null }
      return (<li key={id}>
        {substances.get(id).get('title')}
        <a href='#' onClick={(e) => this.removeSubstance(id)}> X </a>
      </li>)
    })

    const showSubstancesDropdown = (siteSubstances.size < 13 && !!groupedSubstanceOptions.size)

    return (
      <div>
        <Form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            props={{label: 'Site Map', placeholder: 'Select Site Map'}}
            name='sitemap_id'
            id='sitemap_id'
            options={siteMapOptions}
            component={SelectFormGroup}
          />

          <Field
            props={{label: 'Start Date', placeholder: 'Select start date'}}
            name='date_collected'
            id='date_collected'
            options={startDateOptions}
            component={SelectFormGroup}
           />

          <Field
            props={{label: 'End Date', placeholder: 'Select end date (optional)'}}
            name='date_collected_range_end'
            id='date_collected_range_end'
            options={endDateOptions}
            component={SelectFormGroup}
          />

          <Field
            props={{label: 'Comparison Criteria', placeholder: ' '}}
            name='criteria_id'
            id='criteria_id'
            options={criteriaOptions}
            component={SelectFormGroup}
          />

          Substances (no more than 13)
          <ul>
            {siteSubstances}
          </ul>

          { showSubstancesDropdown &&
            <Input type='select' onChange={this.addSubstance.bind(this)}>
              <option value=''>Select a substance</option>
              {groupedSubstanceOptions}
            </Input>
          }

          <Button
            color="primary"
          >Save</Button>
        </Form>
      </div>
    )
  }
}

AnalyticalBoxmapsForm = reduxForm({form: 'AnalyticalBoxmapsForm', destroyOnUnmount: false })(AnalyticalBoxmapsForm)

const selector = formValueSelector('AnalyticalBoxmapsForm')
const mapStateToProps = (state, ownProps) => ({
  substances: state.get('substances'),
  substanceGroups: state.get('substanceGroups'),
  criterias: state.get('criterias'),

  sampleDates: state.get('sampleDates'),
  siteMaps: state.get('siteMaps'),
  date_collected: selector(state, 'date_collected'),
  date_collected_range_end: selector(state, 'date_collected_range_end'),
})

const mapDispatchToProps = (dispatch) => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  createAnalyticalBoxmaps: (boxmapsParams) => dispatch(createAnalyticalBoxmaps(boxmapsParams)),
  fetchSubstances: () => dispatch(fetchSubstances()),
  fetchSubstanceGroups: () => dispatch(fetchSubstanceGroups()),
  fetchSiteMaps: filters => dispatch(fetchSiteMaps(filters)),
  fetchSamples: filters => dispatch(fetchSamples(filters)),
  fetchSampleDates: siteId => dispatch(fetchSampleDates(siteId)),
  fetchCriterias: filters => dispatch(fetchCriterias(filters)),

  editSite: (id, siteParams) => dispatch(editSite(id, siteParams))
})

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticalBoxmapsForm)
