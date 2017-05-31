import React from 'react'

import {
  Button,
  Form,
} from 'reactstrap'

import { Field, reduxForm } from 'redux-form/immutable'
import IndividualFormGroup from 'SharedComponents/ReduxFormHelpers/IndividualFormGroup'
import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'
import FormButton from 'SharedComponents/ReduxFormHelpers/FormButton'

import STATES from 'helpers/states'
import { msgFromError } from 'helpers/util'

class SiteForm extends React.Component {

  componentDidMount () {
    if (this.props.siteError) {
      this.props.clearSiteError()
    }
  }

  render () {
    const error = this.props.siteError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
      [error.key]: msgFromError(error),
    } : {}

    const stateOptions = STATES.map((state) => (
      <option key={state.state_id} value={state.state_id}>{state.title}</option>)
    )

    let projectField = null
    if (this.props.projectOptions) {
      const projectOptions = this.props.projectOptions.valueSeq().map((project) =>
        <option key={project.get('id')} value={project.get('id')}>
          {project.get('name')}
        </option>)


      projectField = <Field
        props={{ error: errors.project_id, label: 'Project', placeholder: 'Choose a project...' }}
        name='project_id'
        id='project_id'
        component={SelectFormGroup}
        options={projectOptions} />
    }

    const { handleSubmit, submitForm } = this.props

    return (
      <Form onSubmit={handleSubmit(submitForm)}>
        {projectField}

        <Field
          props={{ error: errors.title, label: 'Site Name'}}
          name='title'
          id='title'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.notes, label: 'Notes'}}
          name='notes'
          id='notes'
          component={IndividualFormGroup}
          type='textarea'
        />

        <Field
          props={{ error: errors.address, label: 'Address'}}
          name='address'
          id='address'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.city, label: 'City'}}
          name='city'
          id='city'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.state_id, label: 'State', placeholder: 'Choose a state...' }}
          name='state_id'
          id='state_id'
          showLabel={true}
          component={SelectFormGroup}
          options={stateOptions}
        />

        <Field
          props={{ error: errors.zip, label: 'Zip Code'}}
          name='zip'
          id='zip'
          component={IndividualFormGroup}
          type='text'
        />


        <Field
          props={{ error: errors.county, label: 'County'}}
          name='county'
          id='county'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.latitude, label: 'Latitude'}}
          name='latitude'
          id='latitude'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.longitude, label: 'Longitude'}}
          name='longitude'
          id='longitude'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.start_sampling_on, label: 'Start Sampling On'}}
          name='start_sampling_on'
          id='start_sampling_on'
          component={IndividualFormGroup}
          type='text'
        />

        <FormButton
            role="button"
            color="primary"
            disabled={this.props.submittingForm}
        >Save Site</FormButton>
      </Form>
    )
  }
}

SiteForm = reduxForm({ form: 'SiteForm' })(SiteForm)

export default SiteForm
