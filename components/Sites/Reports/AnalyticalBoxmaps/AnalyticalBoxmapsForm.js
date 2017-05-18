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

import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'

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
  componentDidMount () {
    this.props.fetchSiteMaps({ site_id: this.props.site.get('id') })
    this.props.fetchSamples({ site_id: this.props.site.get('id') })
    this.props.fetchSampleDates(this.props.site.get('id'))
    this.props.fetchCriterias({ state_id: this.props.site.get('state_id'), active: true })
    this.props.fetchSubstances()
    this.props.fetchSubstanceGroups()
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
    const { sampleDates, start_date: t_start_date, end_date: t_end_date } = this.props
    if (!t_start_date || !t_end_date) { return false }
    const start_date = moment(t_start_date)
    const end_date = moment(t_end_date)
    let isPresent = false

    sampleDates.forEach((date) => {
      const d = moment(date.get('date_collected'))
      // debugger
      if ((d.isBetween(start_date, end_date) || d.isSame(start_date) || d.isSame(end_date)) &&
          date.get('substance_ids').includes(substanceId)) {
        isPresent = true
      }

    })

    return isPresent
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
    } =  this.props

    const siteMapOptions = siteMaps.valueSeq().map((siteMap) =>
      <option key={siteMap.get('id')} value={siteMap.get('id')}>{siteMap.get('title')}</option>)


    const dateOptions = sampleDates.valueSeq().map((date, i) =>
      <option key={date.get('id')} value={date.get('date_collected')}>{date.get('date_collected')}</option>)

    const criteriaOptions = criterias.valueSeq().map((criteria) =>
      <option key={criteria.get('id')} value={criteria.get('id')}>{criteria.get('title')}</option>)

    const groupedSubstances = substanceGroups.map((substanceGroup) =>
      substances.filter((substance) => (substance.get('substance_group_id') === substanceGroup.get('id')))
    )

    const groupedSubstanceOptions = groupedSubstances.map((substances, substanceGroupId) =>
      <optgroup key={substanceGroupId} label={substanceGroups.get(substanceGroupId).get('title')}>
        {substances.valueSeq().map(substance => {
          if (site.get('substance_ids').includes(substance.get('id')) ||
            substanceIdInDateRange(substance.get('id'))
          ) { return null }
          return (<option key={substance.get('id')} value={substance.get('id')}>{substance.get('title')}</option>)
        })}
      </optgroup>
    ).filter((substanceGroup) => substanceGroup.props.children.size).valueSeq()


    const siteSubstances = site.get('substance_ids').map((id) => {
      if (!substances.size) { return null }
      return (<li key={id}>
        {substances.get(id).get('title')}
        <a href='#' onClick={(e) => this.removeSubstance(id)}> X </a>
      </li>)
    })

    return (
      <div>
        <Form>
          <Field
            props={{label: 'Site Map'}}
            name='sitemap'
            id='sitemap'
            options={siteMapOptions}
            component={SelectFormGroup}
          />

          <Field
            props={{label: 'Start Date'}}
            name='start_date'
            id='start_date'
            options={dateOptions}
            component={SelectFormGroup}
           />

          <Field
            props={{label: 'End Date'}}
            name='end_date'
            id='end_date'
            options={dateOptions}
            component={SelectFormGroup}
          />

          <Field
            props={{label: 'Comparison Criteria'}}
            name='criteria_id'
            id='criteria_id'
            options={criteriaOptions}
            component={SelectFormGroup}
          />

          Substances (no more than 13)
          <ul>
            {siteSubstances}
          </ul>

          { siteSubstances.size < 13 &&
            <Input type='select' onChange={this.addSubstance.bind(this)}>
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
  start_date: selector(state, 'start_date'),
  end_date: selector(state, 'end_date'),
})

const mapDispatchToProps = (dispatch) => ({
  fetchSubstances: () => dispatch(fetchSubstances()),
  fetchSubstanceGroups: () => dispatch(fetchSubstanceGroups()),
  fetchSiteMaps: filters => dispatch(fetchSiteMaps(filters)),
  fetchSamples: filters => dispatch(fetchSamples(filters)),
  fetchSampleDates: siteId => dispatch(fetchSampleDates(siteId)),
  fetchCriterias: filters => dispatch(fetchCriterias(filters)),

  editSite: (id, siteParams) => dispatch(editSite(id, siteParams))
})

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticalBoxmapsForm)
