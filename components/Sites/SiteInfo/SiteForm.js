import React from 'react'

import {
  Button,
  Form,
} from 'reactstrap'

import { Field, reduxForm } from 'redux-form/immutable'
import IndividualFormGroup from 'SharedComponents/ReduxFormHelpers/IndividualFormGroup'
import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'
import DatePickerFormGroup from 'SharedComponents/ReduxFormHelpers/DatePickerFormGroup'
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
    const { isCompleteSiteForm } = this.props
    const error = this.props.siteError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
      [error.key]: msgFromError(error),
    } : {}

    const stateOptions = STATES.map((state) =>
     ({ value: state.state_id, label: state.title })
    )

    let clientField = null
    if (this.props.clientOptions) {
      const clientOptions = this.props.clientOptions.valueSeq()
        .map((client) => ({
          value: client.get('id'),
          label: client.get('name'),
        }))
        .toJS()


      clientField = <Field
        props={{ error: errors.client_id, label: 'Client*', placeholder: 'Choose a client...' }}
        name='client_id'
        id='client_id'
        component={SelectFormGroup}
        options={clientOptions} />
    }

    const { handleSubmit, submitForm } = this.props

    return (
      <Form onSubmit={handleSubmit(submitForm)}>
        {clientField}

        <Field
          props={{ error: errors.title, label: 'Site Name*'}}
          name='title'
          id='title'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.address, label: 'Address'}}
          name='address'
          id='address'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.city, label: 'City*'}}
          name='city'
          id='city'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.state_id, label: 'State*', placeholder: 'Choose a state...' }}
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

        { !isCompleteSiteForm && <Field
          props={{ error: errors.start_sampling_on, label: 'Start Sampling On'}}
          name='start_sampling_on'
          id='start_sampling_on'
          component={DatePickerFormGroup}
          type='text'
        />
        }

        { !isCompleteSiteForm && <Field
          props={{ error: errors.notes, label: 'Notes'}}
          name='notes'
          id='notes'
          component={IndividualFormGroup}
          type='textarea'
        />
        }

        <FormButton
          role="button"
          color="primary"
          disabled={this.props.submittingForm}
        >
          Save Site
          { isCompleteSiteForm && <i className='material-icons'>chevron_right</i> }
        </FormButton>
      </Form>
    )
  }
}

SiteForm = reduxForm({ form: 'SiteForm' })(SiteForm)

export default SiteForm
