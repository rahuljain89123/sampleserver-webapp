import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
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
import { fetchCriterias } from 'actions/criterias'
import { editSite } from 'actions/sites'

class AnalyticalBoxmapsForm extends React.Component {
  componentDidMount () {
    this.props.fetchSiteMaps({ site_id: this.props.site.get('id') })
    this.props.fetchSamples({ site_id: this.props.site.get('id') })
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

  render () {
    const {
      site,
      siteMaps,
      substances,
      substanceGroups,
      dates,
      criterias,
    } =  this.props

    const siteMapOptions = siteMaps.valueSeq().map((siteMap) =>
      <option key={siteMap.get('id')} value={siteMap.get('id')}>{siteMap.get('title')}</option>)

    const dateOptions = dates.valueSeq().map((date, i) =>
      <option key={i}>{date.format('YYYY-MM-DD')}</option>)

    const criteriaOptions = criterias.valueSeq().map((criteria) =>
      <option key={criteria.get('id')} value={criteria.get('id')}>{criteria.get('title')}</option>)

    const groupedSubstances = substanceGroups.map((substanceGroup) =>
      substances.filter((substance) => (substance.get('substance_group_id') === substanceGroup.get('id')))
    )

    const groupedSubstanceOptions = groupedSubstances.map((substances, substanceGroupId) =>
      <optgroup key={substanceGroupId} label={substanceGroups.get(substanceGroupId).get('title')}>
        {substances.valueSeq().map(substance => {
          if (site.get('substance_ids').includes(substance.get('id'))) { return null }
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

          { siteSubstances.size < 13 && <Input type='select' onChange={this.addSubstance.bind(this)}>
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

AnalyticalBoxmapsForm = reduxForm({form: 'AnalyticalBoxmapsForm'})(AnalyticalBoxmapsForm)

const mapStateToProps = (state) => ({
  substances: state.get('substances'),
  substanceGroups: state.get('substanceGroups'),
  criterias: state.get('criterias'),
  dates: state.get('samples')
    .valueSeq()
    .map((sample) => moment(sample.get('date_collected'))),
  siteMaps: state.get('siteMaps'),
})

const mapDispatchToProps = (dispatch) => ({
  fetchSubstances: () => dispatch(fetchSubstances()),
  fetchSubstanceGroups: () => dispatch(fetchSubstanceGroups()),
  fetchSiteMaps: filters => dispatch(fetchSiteMaps(filters)),
  fetchSamples: filters => dispatch(fetchSamples(filters)),
  fetchCriterias: filters => dispatch(fetchCriterias(filters)),

  editSite: (id, siteParams) => dispatch(editSite(id, siteParams))
})

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticalBoxmapsForm)
