import React from 'react'
import { connect } from 'react-redux'
import { Field,
  reduxForm,
  formValueSelector,
} from 'redux-form/immutable'

import {
  createSiteData,
  fetchSiteDatas,
  editSiteData,
} from 'actions/siteData'

import {
    Button,
    Form,
} from 'reactstrap'
import IndividualFormGroup from 'SharedComponents/ReduxFormHelpers/IndividualFormGroup'
import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'
import RadioFormGroup from 'SharedComponents/ReduxFormHelpers/RadioFormGroup'

/**
 * MISSING FIELDS
 * --------------
 * Permission is given for the Department of Environmental Quality to contact the QC: (YES, NO)
 * Site Classification, Previous Classification: INTEGER (1-4)
 * Substances released
 * Depth to groundwater
 * Is mobile NAPL Present (and all subsequent fields)
 * Is migrating NAPL present
 * Drinking Water Supply Affected
 * Is site within a wellhead protection zone
 * Report Type
 */
class StateSpecificInfoForm extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }
  componentDidMount () {
    if (!this.props.siteData) {
      this.props.fetchSiteDatas({ site_id: this.props.site.get('id') })
    }
  }

  onSubmit (siteDataParams) {
    const { siteData, site, createSiteData, editSiteData } = this.props
    siteDataParams = siteDataParams.set(
      'michigan_rbca_site_classification',
      parseInt(siteDataParams.get('michigan_rbca_site_classification'))
    )
    if (!siteData) {
      siteDataParams = siteDataParams.set('site_id', site.get('id'))
      createSiteData(siteDataParams)
    } else {
      editSiteData(siteData.get('id'), siteDataParams)
    }
  }

  render () {
    const {
      handleSubmit,
      editingSiteData,
      contamination_migrated_off_site,
      impacted_parties_notified,
      michigan_rbca_site_classification,
      vapors_in_confined_space,
    } = this.props
    const error = this.props.editingSiteDataError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
        [error.key]: msgFromError(error),
    } : {}

    const selectOptions= [1, 2, 3, 4].map((i) => (<option>{i}</option>))

    const rbcaClassificationOptions = [1, 2, 3].map((i) => ({ value: i, title: `Tier ${i}`}))
    const booleanOptions = [{ value: true, title: 'YES' }, { value: false, title: 'NO' }]

    return (<Form onSubmit={handleSubmit(this.onSubmit)}>
      <Field
        props={{ error: errors.date_release_discovered, label: 'Date(s) Release(s) Discovered' }}
        name='date_release_discovered'
        id='date_release_discovered'
        component={IndividualFormGroup}
        type='text'
      />

      <Field
        props={{ error: errors.confirmed_release_number, label: 'Confirmed Release Number' }}
        name='confirmed_release_number'
        id='confirmed_release_number'
        component={IndividualFormGroup}
        type='text'
      />

      <Field
        props={{ error: errors.michigan_rbca_site_classification, label: 'Type of RBCA Evaluation' }}
        name='michigan_rbca_site_classification'
        id='michigan_rbca_site_classification'
        component={RadioFormGroup}
        options={rbcaClassificationOptions}
        mValue={michigan_rbca_site_classification}
      />

      <Field
        props={{ error: errors.contamination_migrated_off_site, label: 'Has contamination migrated off-site above Tier 1 Residential RBSLs?' }}
        name='contamination_migrated_off_site'
        id='contamination_migrated_off_site'
        component={RadioFormGroup}
        options={booleanOptions}
        mValue={contamination_migrated_off_site}
      />

      {contamination_migrated_off_site && <Field
        props={{ error: errors.impacted_parties_notified, label: 'If YES, have off-site impacted parties been notified per Section 21309a(3) of Part 213?' }}
        name='impacted_parties_notified'
        id='impacted_parties_notified'
        component={RadioFormGroup}
        options={booleanOptions}
        mValue={impacted_parties_notified}
      />}

      <Field
        props={{ error: errors.groundwater_flow_direction, label: 'Predominant groundwater flow direction:' }}
        name='groundwater_flow_direction'
        id='groundwater_flow_direction'
        component={IndividualFormGroup}
        type='text'
      />

      <Field
        props={{ error: errors.groundwater_flow_direction, label: 'Predominant groundwater flow direction:' }}
        name='groundwater_flow_direction'
        id='groundwater_flow_direction'
        component={IndividualFormGroup}
        type='text'
      />

      <h3> Since Last Report </h3>

      <Field
        props={{ error: errors.soil_remediated_since_last_report, label: 'Cubic Yards Remediated:' }}
        name='soil_remediated_since_last_report'
        id='soil_remediated_since_last_report'
        component={IndividualFormGroup}
        type='text'
      />

      <Field
        props={{ error: errors.groundwater_remediated_since_last_report, label: 'Gallons of Water Remediated:' }}
        name='groundwater_remediated_since_last_report'
        id='groundwater_remediated_since_last_report'
        component={IndividualFormGroup}
        type='text'
      />

      <h3> Totals to date </h3>

      <Field
        props={{ error: errors.soil_remediated, label: 'Cubic Yards Remediated:' }}
        name='soil_remediated'
        id='soil_remediated'
        component={IndividualFormGroup}
        type='text'
      />

      <Field
        props={{ error: errors.groundwater_remediated, label: 'Gallons of Water Remediated:' }}
        name='groundwater_remediated'
        id='groundwater_remediated'
        component={IndividualFormGroup}
        type='text'
      />

      <Field
        props={{ error: errors.vapors_in_confined_space, label: 'Have toxic or explosive vapors been identified in any confined spaces (basement, sewers, ect.)?' }}
        name='vapors_in_confined_space'
        id='vapors_in_confined_space'
        component={RadioFormGroup}
        options={booleanOptions}
        mValue={vapors_in_confined_space}
      />

      <h3> Estimated distance and direction from point of release to nearest: </h3>

      <Field
        props={{ error: errors.point_of_release_to_private_well, label: 'Private well' }}
        name='point_of_release_to_private_well'
        id='point_of_release_to_private_well'
        component={IndividualFormGroup}
        type='text'
      />

      <Field
        props={{ error: errors.point_of_release_to_municipal_well, label: 'Municipal Well' }}
        name='point_of_release_to_municipal_well'
        id='point_of_release_to_municipal_well'
        component={IndividualFormGroup}
        type='text'
      />

      <Field
        props={{ error: errors.point_of_release_to_surface_water, label: 'Surface water/wetland' }}
        name='point_of_release_to_surface_water'
        id='point_of_release_to_surface_water'
        component={IndividualFormGroup}
        type='text'
      />

      <Button
        color="primary"
        disabled={editingSiteData}
      >Save</Button>

    </Form>)
  }
}

const FORM_NAME = 'stateSpecificInfoForm'

StateSpecificInfoForm = reduxForm({ form: FORM_NAME })(StateSpecificInfoForm)

const selector = formValueSelector(FORM_NAME)

const mapStateToProps = (state, ownProps) => {
  const site = ownProps.site
  const siteData = state.get('siteDatas').filter((siteData) => siteData.get('site_id') === site.get('id')).first()

  const initialValues = siteData ? siteData.set('contamination_migrated_off_site', siteData.get('contamination_migrated_off_site').toString()) : siteData

  return {
    siteData,
    siteDataId: siteData ? siteData.get('id') : null,
    initialValues,
    contamination_migrated_off_site: selector(state, 'contamination_migrated_off_site') === 'true',
    michigan_rbca_site_classification: parseInt(selector(state, 'michigan_rbca_site_classification')),
    impacted_parties_notified: selector(state, 'impacted_parties_notified') === 'true',
    vapors_in_confined_space: selector(state, 'vapors_in_confined_space') === 'true',

    editingSiteData: state.get('editingSiteData'),
    editingSiteDataError: state.get('editingSiteDataError')
  }
}

const mapDispatchToProps = (dispatch) => ({
  createSiteData: (siteDataParams) => dispatch(createSiteData(siteDataParams)),
  editSiteData: (id, siteDataParams) => dispatch(editSiteData(id, siteDataParams)),
  fetchSiteDatas: (filters) => dispatch(fetchSiteDatas(filters)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StateSpecificInfoForm)
