import React from 'react'

import {
  Button,
  Form,
} from 'reactstrap'

import { Field, reduxForm } from 'redux-form/immutable'
import IndividualFormGroup from 'SharedComponents/ReduxFormHelpers/IndividualFormGroup'
import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'

import { msgFromError } from 'helpers/util'

class ContactForm extends React.Component {

  componentDidMount () {
    if (this.props.formError) {
      this.props.clearFormError()
    }
  }

  render () {
    const error = this.props.formError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
      [error.key]: msgFromError(error),
    } : {}

    const typeOptions = [
      'Regulatory',
      'Account Holder/Invoicing',
      'Consultant/Engineer',
      'Laboratory',
      'Site Owner',
      'Primary Site Contact',
    ].map(opt => ({ value: opt, label: opt}))

    const { handleSubmit, submitForm } = this.props

    return (
      <Form onSubmit={handleSubmit(submitForm)}>
        <Field
          props={{ error: errors.type, label: 'Type' }}
          name='type'
          id='type'
          component={SelectFormGroup}
          options={typeOptions}
        />

        <Field
          props={{ error: errors.title, label: 'Company Name'}}
          name='title'
          id='title'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.contact, label: 'Contact'}}
          name='contact'
          id='contact'
          component={IndividualFormGroup}
          type='text'
        />


        <Field
          props={{ error: errors.phone, label: 'Office Phone #'}}
          name='phone'
          id='phone'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.cell, label: 'Mobile Phone #'}}
          name='cell'
          id='cell'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.fax, label: 'Fax'}}
          name='fax'
          id='fax'
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
          props={{ error: errors.city, label: 'City'}}
          name='city'
          id='city'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.state, label: 'State'}}
          name='state'
          id='state'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.zip, label: 'Zip'}}
          name='zip'
          id='zip'
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
        <Button
          role="button"
          color="primary"
          disabled={this.props.submittingForm}
        >Save</Button>
      </Form>
    )
  }
}

ContactForm = reduxForm({ form: 'ContactForm' })(ContactForm)

export default ContactForm
