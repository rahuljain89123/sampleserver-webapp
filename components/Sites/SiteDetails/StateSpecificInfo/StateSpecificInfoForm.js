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
  flashMessage,
} from 'actions/global'

import {
    Button,
    Form,
    FormGroup,
    Label,
    InputGroup,
    InputGroupAddon,
    Row,
    Col,
} from 'reactstrap'
import IndividualFormGroup from 'SharedComponents/ReduxFormHelpers/IndividualFormGroup'
import IndividualInput from 'SharedComponents/ReduxFormHelpers/IndividualInput'
import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'
import RadioFormGroup from 'SharedComponents/ReduxFormHelpers/RadioFormGroup'
import DatePickerFormGroup from 'SharedComponents/ReduxFormHelpers/DatePickerFormGroup'

const REPORT_TYPES = [
  "Requested Supporting Documentation",
  "Solid or Groundwater Investigation Monitoring",
  "Corrective Active Plan Monitoring",
  "Operative and Maintenance",
  "Soil Vapor Monitoring",
  "LNAPL",
  "Other"
]
const RADIO_BOOLEANS = [
  'contamination_migrated_off_site',
  'impacted_parties_notified',
  'vapors_in_confined_space',
  'mobile_napl_present_currently',
  'mobile_napl_present_previously',
  'mobile_napl_present_recovered',
  'migrating_napl_present_currently',
  'migrating_napl_actions_taken',
  'drinking_water_affected_currently',
  'drinking_water_affected_previously',
  'surface_water_contaminated',
  'wellhead_protection_zone',
  'contact_qc'
]

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
    const {
      siteData,
      site,
      createSiteData,
      editSiteData,
      flashMessage,
    } = this.props

    if (!siteData) {
      siteDataParams = siteDataParams.set('site_id', site.get('id'))
      createSiteData(siteDataParams)
        .then((e) => flashMessage('success', 'State Specific Info Updated!'))
        .catch((e) => flashMessage('danger', 'Sorry, there was an error'))
    } else {
      editSiteData(siteData.get('id'), siteDataParams)
        .then((e) => flashMessage('success', 'State Specific Info Updated!'))
        .catch((e) => flashMessage('danger', 'Sorry, there was an error'))
    }
  }

  render () {
    const {
      handleSubmit,
      editingSiteData,
      contact_qc,
      contamination_migrated_off_site,
      impacted_parties_notified,
      type_of_rbca_evaluation,
      vapors_in_confined_space,
      mobile_napl_present_currently,
      mobile_napl_present_previously,
      mobile_napl_present_recovered,
      migrating_napl_present_currently,
      migrating_napl_actions_taken,
      drinking_water_affected_currently,
      drinking_water_affected_previously,
      surface_water_contaminated,
      wellhead_protection_zone,
      report_type,
      siteData,
    } = this.props

    if (!siteData) { return null }
    const error = this.props.editingSiteDataError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
        [error.key]: msgFromError(error),
    } : {}
    // debugger
    const selectOptions= [1, 2, 3, 4].map((i) => (<option>{i}</option>))

    const rbcaClassificationOptions = ["Tier 1", "Tier 2", "Tier 3"].map((i) => ({ value: i, title: i}))
    const booleanOptions = [{ value: 'true', title: 'YES' }, { value: 'false', title: 'NO' }]
    const siteClassificationOptions = [null, 1, 2, 3, 4].map((i) => <option key={i} value={i}>{i}</option>)

    const reportTypeOptions = REPORT_TYPES.map((reportType) => ({ value: reportType, title: reportType }))

    return (

    <div>
      <h2 className="border-bottom">State Specific Info</h2>
      <Row><Col sm={6}>
        <Form onSubmit={handleSubmit(this.onSubmit)}>

          <Field
            props={{ error: errors.contact_qc, label: 'Permission is given for the Department of Environmental Quality to contact the QC:' }}
            name='contact_qc'
            id='contact_qc'
            component={RadioFormGroup}
            options={booleanOptions}
            mValue={contact_qc}
          />

          <Field
            props={{ error: errors.date_release_discovered, label: 'Date Release Discovered' }}
            name='date_release_discovered'
            id='date_release_discovered'
            component={DatePickerFormGroup}
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
            props={{ error: errors.site_classification, label: 'Site Classification (1-4)' }}
            name='site_classification'
            id='site_classification'
            component={SelectFormGroup}
            options={siteClassificationOptions}
          />

          <Field
            props={{ error: errors.previous_classification, label: 'Previous Classification (1-4)' }}
            name='previous_classification'
            id='previous_classification'
            component={SelectFormGroup}
            options={siteClassificationOptions}
          />

          <Field
            props={{ error: errors.type_of_rbca_evaluation, label: 'Type of RBCA Evaluation' }}
            name='type_of_rbca_evaluation'
            id='type_of_rbca_evaluation'
            component={RadioFormGroup}
            options={rbcaClassificationOptions}
            mValue={type_of_rbca_evaluation}
          />

          <FormGroup tag='fieldset'>
            <h3> Substances Released </h3>
            <Field
              props={{ error: errors.substances_released_gasoline, label: 'Gasoline' }}
              name='substances_released_gasoline'
              id='substances_released_gasoline'
              component={IndividualFormGroup}
              type='checkbox' />
            <Field
              props={{ error: errors.substances_released_diesel, label: 'Diesel' }}
              name='substances_released_diesel'
              id='substances_released_diesel'
              component={IndividualFormGroup}
              type='checkbox' />

            <Field
              props={{ error: errors.substances_released_ethanol, label: 'Ethanol' }}
              name='substances_released_ethanol'
              id='substances_released_ethanol'
              component={IndividualFormGroup}
              type='checkbox' />

            <Field
              props={{ error: errors.substances_released_ethanol_e10, label: 'E-10' }}
              name='substances_released_ethanol_e10'
              id='substances_released_ethanol_e10'
              component={IndividualFormGroup}
              type='checkbox' />

            <Field
              props={{ error: errors.substances_released_ethanol, label: 'E-85' }}
              name='substances_released_ethanol_e85'
              id='substances_released_ethanol_e85'
              component={IndividualFormGroup}
              type='checkbox' />

            <Field
              props={{ error: errors.substances_released_other, label: 'Other' }}
              name='substances_released_other'
              id='substances_released_other'
              component={IndividualFormGroup}
              type='text' />
          </FormGroup>


          <Field
            props={{ error: errors.contamination_migrated_off_site, label: 'Has contamination migrated off-site above Tier 1 Residential RBSLs?' }}
            name='contamination_migrated_off_site'
            id='contamination_migrated_off_site'
            component={RadioFormGroup}
            options={booleanOptions}
            mValue={contamination_migrated_off_site}
          />

          {contamination_migrated_off_site === 'true' && <div className='pl-4'><Field
            props={{ error: errors.impacted_parties_notified, label: 'If YES, have off-site impacted parties been notified per Section 21309a(3) of Part 213?' }}
            name='impacted_parties_notified'
            id='impacted_parties_notified'
            component={RadioFormGroup}
            options={booleanOptions}
            mValue={impacted_parties_notified}
          /></div>}

          <Field
            props={{ error: errors.groundwater_flow_direction, label: 'Predominant groundwater flow direction:' }}
            name='groundwater_flow_direction'
            id='groundwater_flow_direction'
            component={IndividualFormGroup}
            type='text'
          />

          <Field
            props={{ error: errors.depth_to_groundwater, label: 'Depth to groundwater:' }}
            name='depth_to_groundwater'
            id='depth_to_groundwater'
            component={IndividualFormGroup}
            type='text'
          />

          <h3> Is mobile NAPL present? </h3>
          <div className='pl-4'>
            <Field
              props={{ error: errors.mobile_napl_present_currently, label: 'Currently?' }}
              name='mobile_napl_present_currently'
              id='mobile_napl_present_currently'
              component={RadioFormGroup}
              options={booleanOptions}
              mValue={mobile_napl_present_currently}
            />
            <Field
              props={{ error: errors.mobile_napl_present_previously, label: 'Previously?' }}
              name='mobile_napl_present_previously'
              id='mobile_napl_present_previously'
              component={RadioFormGroup}
              options={booleanOptions}
              mValue={mobile_napl_present_previously}
            />


              {(mobile_napl_present_currently === 'true' || mobile_napl_present_previously === 'true') && <div className='pl-4'>
                <Field
                  props={{ error: errors.mobile_napl_present_recovered, label: 'If present, was it recovered?' }}
                  name='mobile_napl_present_recovered'
                  id='mobile_napl_present_recovered'
                  component={RadioFormGroup}
                  options={booleanOptions}
                  mValue={mobile_napl_present_recovered} />
                  { mobile_napl_present_recovered==='true' && (<div className='pl-4'>
                    <Field
                      props={{ error: errors.mobile_napl_present_recovered_gallons, label: 'If Recoverable, total gallons recovered since last report:' }}
                      name='mobile_napl_present_recovered_gallons'
                      id='mobile_napl_present_recovered_gallons'
                      component={IndividualFormGroup}
                      type='text' />

                    <Field
                      props={{ error: errors.mobile_napl_present_recovered_date, label: 'To date:' }}
                      name='mobile_napl_present_recovered_date'
                      id='mobile_napl_present_recovered_date'
                      component={IndividualFormGroup}
                      type='text' />
                  </div>)}
                </div>
              }
          </div>

          <br />

          <Field
            props={{ error: errors.migrating_napl_present_currently, label: 'Is migrating NAPL present:' }}
            name='migrating_napl_present_currently'
            id='migrating_napl_present_currently'
            component={RadioFormGroup}
            options={booleanOptions}
            mValue={migrating_napl_present_currently}
          />

          { migrating_napl_present_currently === 'true' && <div className='pl-4'><Field
            props={{ error: errors.migrating_napl_actions_taken, label: 'If YES, have actions been taken to prevent migration?' }}
            name='migrating_napl_actions_taken'
            id='migrating_napl_actions_taken'
            component={RadioFormGroup}
            options={booleanOptions}
            mValue={migrating_napl_actions_taken}
            /></div>
          }


          <h3> Since Last Report </h3>
          <div className='pl-4'>
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
          </div>

          <h3> Totals to date </h3>
          <div className='pl-4'>
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
          </div>

          <Field
            props={{ error: errors.vapors_in_confined_space, label: 'Have toxic or explosive vapors been identified in any confined spaces (basement, sewers, ect.)?' }}
            name='vapors_in_confined_space'
            id='vapors_in_confined_space'
            component={RadioFormGroup}
            options={booleanOptions}
            mValue={vapors_in_confined_space}
          />

          <h3> Drinking water supply affected? </h3>
          <div className='pl-4'>
            <Field
              props={{ error: errors.drinking_water_affected_currently, label: 'Currently:' }}
              name='drinking_water_affected_currently'
              id='drinking_water_affected_currently'
              component={RadioFormGroup}
              options={booleanOptions}
              mValue={drinking_water_affected_currently}
            />

            <Field
              props={{ error: errors.drinking_water_affected_previously, label: 'Previously:' }}
              name='drinking_water_affected_previously'
              id='drinking_water_affected_previously'
              component={RadioFormGroup}
              options={booleanOptions}
              mValue={drinking_water_affected_previously}
            />

          </div>

          <h3> Indicate type and # of wells affected: </h3>
          <div className='pl-4'>
            <InputGroup>
              <Field
                name='drinking_water_affected_private'
                id='drinking_water_affected_private'
                component={IndividualInput}
                type='checkbox' />
              <InputGroupAddon> Private # </InputGroupAddon>
              <Field
                name='drinking_water_affected_private_num_wells'
                id='drinking_water_affected_private_num_wells'
                type='text'
                component={IndividualInput} />
            </InputGroup>

            <InputGroup>
              <Field
                name='drinking_water_affected_public'
                id='drinking_water_affected_public'
                component={IndividualInput}
                type='checkbox' />
              <InputGroupAddon> Public Type II/III # </InputGroupAddon>
              <Field
                name='drinking_water_affected_public_num_wells'
                id='drinking_water_affected_public_num_wells'
                type='text'
                component={IndividualInput} />
            </InputGroup>

            <InputGroup>
              <Field
                name='drinking_water_affected_municiple'
                id='drinking_water_affected_municiple'
                component={IndividualInput}
                type='checkbox' />
              <InputGroupAddon> Municipal # </InputGroupAddon>
              <Field
                name='drinking_water_affected_municiple_num_wells'
                id='drinking_water_affected_municiple_num_wells'
                type='text'
                component={IndividualInput} />
            </InputGroup>
          </div>

          <Field
            props={{ error: errors.surface_water_contaminated, label: 'Has surface water / wetlands been contaminated?' }}
            name='surface_water_contaminated'
            id='surface_water_contaminated'
            component={RadioFormGroup}
            options={booleanOptions}
            mValue={surface_water_contaminated}
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

          <Field
            props={{ error: errors.wellhead_protection_zone, label: 'Is site within a wellhead protection zone?' }}
            name='wellhead_protection_zone'
            id='wellhead_protection_zone'
            component={RadioFormGroup}
            options={booleanOptions}
            mValue={wellhead_protection_zone}
          />

          <Field
            props={{ error: errors.report_type, label: 'Type of report:' }}
            name='report_type'
            id='report_type'
            component={RadioFormGroup}
            options={reportTypeOptions}
            mValue={report_type}
          />

          {report_type === 'Other' && <div className='pl-4'><Field
            props={{ error: errors.report_type_other, label: 'If Other, please specify:' }}
            name='report_type_other'
            id='report_type_other'
            component={IndividualFormGroup}
            type='text'
          /></div> }


          <Button
            color="primary"
            disabled={editingSiteData}
          >Save</Button>

        </Form>
      </Col></Row>
    </div>)
  }
}

const FORM_NAME = 'stateSpecificInfoForm'

StateSpecificInfoForm = reduxForm({ form: FORM_NAME })(StateSpecificInfoForm)

const selector = formValueSelector(FORM_NAME)

const mapStateToProps = (state, ownProps) => {
  const site = ownProps.site
  const siteData = state.get('siteDatas').filter((siteData) => siteData.get('site_id') === site.get('id')).first()
  let initialValues = siteData
  // const initialValues = siteData ? siteData.set('contamination_migrated_off_site', siteData.get('contamination_migrated_off_site').toString()) : siteData

  if (initialValues) {
    RADIO_BOOLEANS.forEach((key) => {
     initialValues = initialValues.set(key, initialValues.get(key) ? initialValues.get(key).toString() : '')
    })
  }

  let props = {
    siteData,
    siteDataId: siteData ? siteData.get('id') : null,
    initialValues,
    editingSiteData: state.get('editingSiteData'),
    editingSiteDataError: state.get('editingSiteDataError'),
  }

  RADIO_BOOLEANS.concat('type_of_rbca_evaluation', 'report_type').forEach((key) => {
    props[key] = selector(state, key)
  })
  return props
}

const mapDispatchToProps = (dispatch) => ({
  createSiteData: (siteDataParams) => dispatch(createSiteData(siteDataParams)),
  editSiteData: (id, siteDataParams) => dispatch(editSiteData(id, siteDataParams)),
  fetchSiteDatas: (filters) => dispatch(fetchSiteDatas(filters)),
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StateSpecificInfoForm)
