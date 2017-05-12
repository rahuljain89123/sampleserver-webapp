import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import moment from 'moment'
import {
  Form,
  Input,
} from 'reactstrap'

import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'

import {
  fetchSubstances,
  fetchSubstanceGroups,
} from 'actions/substances'
import { fetchSiteMaps } from 'actions/siteMaps'
import { fetchSamples } from 'actions/samples'
import { fetchCriterias } from 'actions/criterias'

class AnalyticalBoxmapsForm extends React.Component {
  componentDidMount () {
    this.props.fetchSiteMaps({ site_id: this.props.site.get('id') })
    this.props.fetchSamples({ site_id: this.props.site.get('id') })
    this.props.fetchCriterias({ state_id: this.props.site.get('state_id'), active: true })
    this.props.fetchSubstances()
    this.props.fetchSubstanceGroups()
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

    const dateOptions = dates.map((date, i) =>
      <option key={i}>{date.format('YYYY-MM-DD')}</option>)

    const criteriaOptions = criterias.map((criteria) =>
      <option key={criteria.get('id')} value={criteria.get('id')}>{criteria.get('title')}</option>)

    const groupedSubstances = substanceGroups.map((substanceGroup) =>
      substances.filter((substance) => (substance.get('substance_group_id') === substanceGroup.get('id')))
    )

    // debugger

    // if (substances.size) { debugger }

    const groupedSubstanceOptions = groupedSubstances.map((substances, substanceGroupId) =>
      <optgroup key={substanceGroupId} label={substanceGroups.get(substanceGroupId).get('title')}>
        {substances.valueSeq().map(substance =>
          (<option value={substance.get('id')}>{substance.get('title')}</option>))}
      </optgroup>
    ).valueSeq()

    const siteSubstances = site.get('substance_ids').map((id) =>
      <li key={id}>
        {substance.get(id).get('title')}
        <a href='#'> X </a>
      </li>
    )
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

        Substances
        <ul>
          {siteSubstances}
        </ul>

        <Input type='select'>
          {groupedSubstanceOptions}
        </Input>
      </Form>
        Criterias
        <ul>
          {this.props.criterias.valueSeq().map((sub) => <li key={sub.get('id')}>{sub.get('title')}</li>)}
        </ul>
        Samples
        <ul>
          {this.props.dates.valueSeq().map((sub, i) => <li key={i}>{sub.format('YYYY-MM-DD')}</li>)}
        </ul>
        Substances
        <ul>
          {this.props.substances.valueSeq().map((sub) => <li key={sub.get('id')}>{sub.get('title')}</li>)}
        </ul>
        Substance Groups
        <ul>
          {this.props.substanceGroups.valueSeq().map((sub) => <li key={sub.get('id')}>{sub.get('title')}</li>)}
        </ul>
        SiteMaps
        <ul>
          {this.props.siteMaps.valueSeq().map((sitemap) => <li key={sitemap.get('id')}>{sitemap.get('title')}</li>)}
        </ul>
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
  fetchCriterias: filters => dispatch(fetchCriterias(filters))
})

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticalBoxmapsForm)
