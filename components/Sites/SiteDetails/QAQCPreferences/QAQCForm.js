import React from 'react'
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

import { editSite }   from 'actions/sites'
import { fetchWells } from 'actions/wells'
import { fetchTests } from 'actions/tests'

const renderTests= ({ fields, options }) => {
  return (<ul>
    {fields.map((test, index) => {
      const onClick = (e) => {
        e.preventDefault()
        fields.remove(index)
      }
      return <li key={index}>
        <InputGroup>
          <Field
            name={test}
            component={IndividualSelect}
            options={options}
            />
          <InputGroupButton>
            <Button onClick={onClick}>Remove</Button>
          </InputGroupButton>
        </InputGroup>
      </li>
    })}

    <li>
      <button type="button" onClick={() => fields.push()}>Add Test</button>
    </li>
  </ul>)
}


const renderWells= ({ fields, options }) => {
  const addButton = (e) => {
    e.preventDefault()
    fields.push()
  }
  console.log(fields.length)
  return (<ul>
    {fields.map((well, index) => {
      const removeButton = (e) => {
        e.preventDefault()
        fields.remove(index)
      }


      return <li key={index}>
        <InputGroup>
          <Field
            name={well}
            component={IndividualSelect}
            options={options}

            />
          <InputGroupButton>
            <Button onClick={removeButton}>Remove</Button>
          </InputGroupButton>
        </InputGroup>
      </li>
    })}

    <li>
      <Button onClick={addButton}>Add Well</Button>
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
  }

  onSubmit (qaqcParams) {
    this.props.editSite(this.props.site.get('id'), qaqcParams)
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
      .valueSeq()
      .map((test) => <option key={test.get('id')} value={test.get('id')}>{test.get('title')}</option>)

    const wellOptions = wells.valueSeq()
      .map((well) => <option key={well.get('id')} value={well.get('id')}>{well.get('title')}</option>)

    const perSamplesOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((i) => <option key={i} value={i}>{`${i} samples`}</option>)
      .concat(<option key='persite' value='persite'>Per Site</option>)
      .concat(<option key='perday' value='perday'>Per Day</option>)

    if (qaqcDuplicates) {
      duplicatesForm = (<div>
        <InputGroup>
          <InputGroupAddon>Collect</InputGroupAddon>
          <Field
            name='qaqc_duplicates_per_samples'
            id='qaqc_duplicates_per_samples'
            component={IndividualInput}
            type='text' />
          <InputGroupAddon> duplicate(s) per </InputGroupAddon>
          <Field
            name='qaqc_duplicates_type'
            id='qaqc_duplicates_type'
            type='select'
            component={IndividualSelect}
            options={perSamplesOptions} />
        </InputGroup>

        <h5>From Wells:</h5>
        <FieldArray name='qaqc_duplicates_well_ids' component={renderWells} options={wellOptions}/>

        <h5>Test For:</h5>
        <FieldArray name='qaqc_duplicates_test_ids' component={renderTests} options={testOptions}/>
      </div>)
    }

    if (qaqcMSMSDS) {
      msmsdsForm = (<div>
        <InputGroup>
          <InputGroupAddon>Collect</InputGroupAddon>
          <Field
            name='qaqc_msmsds_per_samples'
            id='qaqc_msmsds_per_samples'
            component={IndividualInput}
            type='text' />
          <InputGroupAddon> duplicate(s) per </InputGroupAddon>
          <Field
            name='qaqc_msmsds_type'
            id='qaqc_msmsds_type'
            type='select'
            component={IndividualSelect}
            options={perSamplesOptions} />
        </InputGroup>

        <h5>From Wells:</h5>
        <FieldArray name='qaqc_msmsds_well_ids' component={renderWells} options={wellOptions}/>

        <h5>Test For:</h5>
        <FieldArray name='qaqc_msmsds_test_ids' component={renderTests} options={testOptions}/>
      </div>)
    }

    if (qaqcFieldBlanks) {
      fieldBlanksForm = (<div>
        <InputGroup>
          <InputGroupAddon>Collect</InputGroupAddon>
          <Field
            name='qaqc_fieldblanks_per_samples'
            id='qaqc_fieldblanks_per_samples'
            component={IndividualInput}
            type='text' />
          <InputGroupAddon> duplicate(s) per </InputGroupAddon>
          <Field
            name='qaqc_fieldblanks_type'
            id='qaqc_fieldblanks_type'
            type='select'
            component={IndividualSelect}
            options={perSamplesOptions} />
        </InputGroup>

        <h5>Test For:</h5>
        <FieldArray name='qaqc_fieldblanks_test_ids' component={renderTests} options={testOptions}/>
      </div>)
    }

    if (qaqcTripBlanks) {
      tripBlanksForm = (<div>
        <InputGroup>
          <InputGroupAddon>Collect</InputGroupAddon>
          <Field
            name='qaqc_tripblanks_per_samples'
            id='qaqc_tripblanks_per_samples'
            component={IndividualInput}
            type='text' />
          <InputGroupAddon> duplicate(s) per </InputGroupAddon>
          <Field
            name='qaqc_tripblanks_type'
            id='qaqc_tripblanks_type'
            type='select'
            component={IndividualSelect}
            options={perSamplesOptions} />
        </InputGroup>

        <h5>Test For:</h5>
        <FieldArray name='qaqc_tripblanks_test_ids' component={renderTests} options={testOptions}/>
      </div>)
    }

    if (qaqcEquipmentBlanks) {
      equipmentBlanksForm = (<div>
        <InputGroup>
          <InputGroupAddon>Collect</InputGroupAddon>
          <Field
            name='qaqc_equipmentblanks_per_samples'
            id='qaqc_equipmentblanks_per_samples'
            component={IndividualInput}
            type='text' />
          <InputGroupAddon> duplicate(s) per </InputGroupAddon>
          <Field
            name='qaqc_equipmentblanks_type'
            id='qaqc_equipmentblanks_type'
            type='select'
            component={IndividualSelect}
            options={perSamplesOptions} />
        </InputGroup>

        <h5>Test For:</h5>
        <FieldArray name='qaqc_equipmentblanks_test_ids' component={renderTests} options={testOptions}/>
      </div>)
    }


    return (<Form onSubmit={handleSubmit(this.onSubmit)}>
      <hr />
        <h3> Duplicates </h3>
        <Field
          props={{ label: 'Collect Duplicates' }}
          name='qaqc_duplicates'
          id='qaqc_duplicates'
          component={IndividualFormGroup}
          type='checkbox'
          />
        {duplicatesForm}

      <hr />
      <h3> MS/MSDs </h3>
      <Field
        props={{ label: 'Collect MS/MSDs' }}
        name='qaqc_msmsds'
        id='qaqc_msmsds'
        component={IndividualFormGroup}
        type='checkbox'
        />
      {msmsdsForm}

      <hr />
      <h3> Field Blanks </h3>
      <Field
        props={{ label: 'Collect Field Blanks' }}
        name='qaqc_fieldblanks'
        id='qaqc_fieldblanks'
        component={IndividualFormGroup}
        type='checkbox'
        />
      {fieldBlanksForm}

      <hr />
      <h3> Trip Blanks </h3>
      <Field
        props={{ label: 'Collect Trip Blanks' }}
        name='qaqc_tripblanks'
        id='qaqc_tripblanks'
        component={IndividualFormGroup}
        type='checkbox'
        />
      {tripBlanksForm}

      <hr />
      <h3> Equipment Blanks (when applicable) </h3>
      <Field
        props={{ label: 'Collect Equipment Blanks' }}
        name='qaqc_equipmentblanks'
        id='qaqc_equipmentblanks'
        component={IndividualFormGroup}
        type='checkbox'
        />
      {equipmentBlanksForm}

      <Button
        color="primary"
        disabled={this.props.editingSite}
      >Save</Button>
    </Form>)
  }
}

const FORM_NAME = 'QAQCForm'

QAQCForm = reduxForm({ form: FORM_NAME })(QAQCForm)

const selector = formValueSelector(FORM_NAME)
const mapStateToProps = (state, ownProps) => ({
  initialValues: ownProps.site,
  qaqcDuplicates: selector(state, 'qaqc_duplicates'),
  qaqcMSMSDS: selector(state, 'qaqc_msmsds'),
  qaqcFieldBlanks: selector(state, 'qaqc_fieldblanks'),
  qaqcTripBlanks: selector(state, 'qaqc_tripblanks'),
  qaqcEquipmentBlanks: selector(state, 'qaqc_equipmentblanks'),

  wells: state.get('wells'),
  tests: state.get('tests'),
})

const mapDispatchToProps = (dispatch) => ({
  fetchWells: () => dispatch(fetchWells()),
  fetchTests: () => dispatch(fetchTests()),
  editSite:   (id, siteParams) => dispatch(editSite(id, siteParams))
})

export default connect(mapStateToProps, mapDispatchToProps)(QAQCForm)
