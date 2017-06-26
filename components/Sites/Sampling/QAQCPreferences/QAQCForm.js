import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import {
  Field,
  reduxForm,
  formValueSelector,
  FieldArray,
} from 'redux-form/immutable'

import {
    Button,
    Form,
    InputGroup,
    InputGroupButton,
    InputGroupAddon,
} from 'reactstrap'
import IndividualFormGroup from 'SharedComponents/ReduxFormHelpers/IndividualFormGroup'
import IndividualInput from 'SharedComponents/ReduxFormHelpers/IndividualInput'
import IndividualSelect from 'SharedComponents/ReduxFormHelpers/IndividualSelect'
import CheckboxFormGroup from 'SharedComponents/ReduxFormHelpers/CheckboxFormGroup'
import { compareAlphaNumeric } from 'helpers/util'

import { editSite }   from 'actions/sites'
import { fetchWells } from 'actions/wells'
import { fetchTests } from 'actions/tests'
import { flashMessage, setHeaderInfo } from 'actions/global'

const renderTests= ({ fields, options }) => {
  const addTest = (e) => {
    e.preventDefault()
    fields.push()
  }

  const allValues = fields.getAll()

  const filteredOptions = (values, options) => {
    values.filter(v => !!v)
      .forEach(v => { options = options.delete(parseInt(v)) })
    return options.valueSeq().toJS()
  }

  return (<ul className="options-list">
    {fields.map((test, index, fields) => {
      const removeTest = (e) => {
        e.preventDefault()
        fields.remove(index)
      }

      return <li key={index}>
        <InputGroup>
          <Field
            name={test}
            component={IndividualSelect}
            options={filteredOptions(allValues.remove(index), options)}
            />
          <InputGroupButton>
            <Button onClick={removeTest}>Remove</Button>
          </InputGroupButton>
        </InputGroup>
      </li>
    })}

    <li>
      <Button onClick={addTest}>Add Test</Button>
    </li>
  </ul>)
}


const renderWells= ({ fields, options, qaqcType }) => {
  const addWell = (e) => {
    e.preventDefault()
    fields.push()
  }

  const allValues = fields.getAll()

  const filteredOptions = (values, options) => {
    values.filter(v => !!v).forEach(v => { options = options.delete(parseInt(v)) })
    return options.valueSeq()
      .sort((a,b) => compareAlphaNumeric(a.label, b.label))
      .toJS()
  }

  return (<ul className="options-list">
    {fields.map((well, index, fields) => {
      const removeWell = (e) => {
        e.preventDefault()
        fields.remove(index)
      }

      return <li key={index}>
        <InputGroup>
          <Field
            name={well}
            component={IndividualSelect}
            options={filteredOptions(allValues.remove(index), options)}
            />
          <InputGroupButton>
            <Button onClick={removeWell}>Remove</Button>
          </InputGroupButton>
        </InputGroup>
      </li>
    })}

    <li>
      <Button onClick={addWell}>Add {qaqcType}</Button>
    </li>
  </ul>)
}

class QAQCForm extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {

    this.props.fetchWells({ site_id: this.props.site.get('id') })
    this.props.fetchTests()
    this.props.setHeaderInfo('QA/QC Preferences+')
  }

  onSubmit (qaqcParams) {
    this.props.editSite(this.props.site.get('id'), qaqcParams)
      .then(() => this.props.flashMessage('success', 'QA/QC Preferences successfully saved'))
      .catch(() => this.props.flashMessage('danger', 'Sorry, there was an error.'))
  }

  render () {
    const {
      qaqcDuplicates,
      qaqcMSMSDS,
      qaqcFieldBlanks,
      qaqcTripBlanks,
      qaqcEquipmentBlanks,
      wells,
      tests,
      handleSubmit,
    } = this.props

    let duplicatesForm = null
    let msmsdsForm = null
    let fieldBlanksForm = null
    let tripBlanksForm = null
    let equipmentBlanksForm = null
    const testOptions = tests.filter((test) => (test.get('state_id') === this.props.site.get('state_id')))
      .map((test) => ({ value: test.get('id'), label: test.get('title') }))

    const wellOptions = wells.map((well) =>
      ({ value: well.get('id'), label: well.get('title') }))

    if (qaqcDuplicates) {
      duplicatesForm = (<div>

        <h5>From Wells:</h5>
        <FieldArray name='qaqc_duplicates_well_ids' component={renderWells} options={wellOptions} qaqcType='Duplicates'/>

        <h5>Test For:</h5>
        <FieldArray name='qaqc_duplicates_test_ids' component={renderTests} options={testOptions}/>
      </div>)
    }

    if (qaqcMSMSDS) {
      msmsdsForm = (<div>

        <h5>From Wells:</h5>
        <FieldArray name='qaqc_msmsds_well_ids' component={renderWells} options={wellOptions} qaqcType='MS/MSDs'/>

        <h5>Test For:</h5>
        <FieldArray name='qaqc_msmsds_test_ids' component={renderTests} options={testOptions}/>
      </div>)
    }

    if (qaqcFieldBlanks) {
      fieldBlanksForm = (<div>
        <h5>Test For:</h5>
        <FieldArray name='qaqc_fieldblanks_test_ids' component={renderTests} options={testOptions}/>
      </div>)
    }

    if (qaqcTripBlanks) {
      tripBlanksForm = (<div>
        <h5>Test For:</h5>
        <FieldArray name='qaqc_tripblanks_test_ids' component={renderTests} options={testOptions}/>
      </div>)
    }

    if (qaqcEquipmentBlanks) {
      equipmentBlanksForm = (<div>
        <h5>Test For:</h5>
        <FieldArray name='qaqc_equipmentblanks_test_ids' component={renderTests} options={testOptions}/>
      </div>)
    }


    return (
      <div className="qa-qc-form">
        <Form onSubmit={handleSubmit(this.onSubmit)}>
            <h3> Duplicates </h3>
            <Field
              props={{ label: 'Collect Duplicates' }}
              name='qaqc_duplicates'
              id='qaqc_duplicates'
              component={CheckboxFormGroup}
              type='checkbox'
              />
            {duplicatesForm}

          <h3> MS/MSDs </h3>
          <Field
            props={{ label: 'Collect MS/MSDs' }}
            name='qaqc_msmsds'
            id='qaqc_msmsds'
            component={CheckboxFormGroup}
            type='checkbox'
            />
          {msmsdsForm}

          <h3> Field Blanks </h3>
          <Field
            props={{ label: 'Collect Field Blanks' }}
            name='qaqc_fieldblanks'
            id='qaqc_fieldblanks'
            component={CheckboxFormGroup}
            type='checkbox'
            />
          {fieldBlanksForm}

          <h3> Trip Blanks </h3>
          <Field
            props={{ label: 'Collect Trip Blanks' }}
            name='qaqc_tripblanks'
            id='qaqc_tripblanks'
            component={CheckboxFormGroup}
            type='checkbox'
            />
          {tripBlanksForm}

          <h3> Equipment Blanks (when applicable) </h3>
          <Field
            props={{ label: 'Collect Equipment Blanks' }}
            name='qaqc_equipmentblanks'
            id='qaqc_equipmentblanks'
            component={CheckboxFormGroup}
            type='checkbox'
            />
          {equipmentBlanksForm}

          <Button
            color="primary"
            disabled={this.props.editingSite}
          >Save</Button>
        </Form>
      </div>
    )
  }
}

const FORM_NAME = 'QAQCForm'

QAQCForm = reduxForm({ form: FORM_NAME })(QAQCForm)

const selector = formValueSelector(FORM_NAME)
const mapStateToProps = (state, ownProps) => {
  const { site } = ownProps
  // const initialValues = site
  //   .set('qaqc_duplicates_test_ids', Immutable.List(site.get('qaqc_duplicates_test_ids')))
  //   .set('qaqc_duplicates_well_ids', Immutable.List(site.get('qaqc_duplicates_well_ids')))
  return {
    initialValues: site,
    qaqcDuplicates: selector(state, 'qaqc_duplicates'),
    qaqcMSMSDS: selector(state, 'qaqc_msmsds'),
    qaqcFieldBlanks: selector(state, 'qaqc_fieldblanks'),
    qaqcTripBlanks: selector(state, 'qaqc_tripblanks'),
    qaqcEquipmentBlanks: selector(state, 'qaqc_equipmentblanks'),

    wells: state.get('wells').filter(well => well.get('site_id') === site.get('id')),
    tests: state.get('tests'),
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchWells: (filters) => dispatch(fetchWells(filters)),
  fetchTests: () => dispatch(fetchTests()),
  editSite:   (id, siteParams) => dispatch(editSite(id, siteParams)),
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  setHeaderInfo: (text, buttons) => dispatch(setHeaderInfo(text, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(QAQCForm)
