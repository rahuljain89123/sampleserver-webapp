
import React from 'react'
import { connect } from 'react-redux'

import {
    Button,
    Form,
    FormGroup,
    FormFeedback,
    Label,
    Input,
} from 'reactstrap'
import { Field, reduxForm } from 'redux-form/immutable';


import { editSite, clearEditingSiteError } from '../../../../actions/sites'
import { msgFromError } from '../../../../util'

// import { msgFromError } from '../../../../util'

const renderField = (field) => {
  return <Input
    { ...field.input}
    type={field.type}
    state={field.state}
    id={field.id} />
}

class EditExecutiveSummaryForm extends React.Component {
  constructor (props) {
    super(props)

    const initialValues = {
      history: props.site.get('history', '') || '',
      background: props.site.get('background', '') || '',
      summary: props.site.get('summary', '') || '',
    }

    this.state = {
      initialValues,
    }
  }

  render () {
    const error = this.props.editingSiteError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
        [error.key]: msgFromError(error),
    } : {}
    const handleSubmit = (e) => { e.preventDefault() }

    return (
      <Form onSubmit={handleSubmit}>
        <FormGroup color={errors.summary ? 'danger' : ''}>
          <Label for="summary">Executive Summary</Label>
          <Field
            props={{ state: (errors.summary ? 'danger' : '') }}
            name="summary"
            id="summary"
            component={renderField}
            type="textarea"
          />
          <FormFeedback>{errors.summary}</FormFeedback>
        </FormGroup>

        <FormGroup color={errors.background ? 'danger' : ''}>
          <Label for="background">Background</Label>
          <Field
            props={{ state: (errors.background ? 'danger' : '') }}
            name="background"
            id="background"
            component={renderField}
            type="textarea"
          />
          <FormFeedback>{errors.background}</FormFeedback>
        </FormGroup>

        <FormGroup color={errors.history ? 'danger' : ''}>
          <Label for="history">History</Label>
          <Field
            props={{ state: (errors.history ? 'danger' : '') }}
            name="history"
            id="history"
            component={renderField}
            type="textarea"
          />
          <FormFeedback>{errors.history}</FormFeedback>
        </FormGroup>
      </Form>
    )
  }
}
const mapStateToProps = store => ({
    editingSiteError: store.get('editingSiteError'),
    editingSite: store.get('editingSite'),
})

const mapDispatchToProps = dispatch => ({
    editSite: (id, site) => dispatch(editSite(id, site)),
    clearEditingSiteError: () => dispatch(clearEditingSiteError()),
})

EditExecutiveSummaryForm =connect(mapStateToProps, mapDispatchToProps)(EditExecutiveSummaryForm)

EditExecutiveSummaryForm = reduxForm({
  form: 'executivesummary'
})(EditExecutiveSummaryForm)

export default EditExecutiveSummaryForm
