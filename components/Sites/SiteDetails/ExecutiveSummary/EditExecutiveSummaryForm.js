
import React from 'react'

import { connect } from 'react-redux'
import { editSite, clearEditingSiteError } from '../../../../actions/sites'

import {
  Row,
  Col,
} from 'reactstrap'

import {
    Button,
    Form,
    FormGroup,
    FormFeedback,
    Label,
} from 'reactstrap'

import { Field, reduxForm } from 'redux-form/immutable'
import { renderInputField } from '../../../shared/ReduxFormHelpers'

import { msgFromError } from '../../../../util'

class EditExecutiveSummaryForm extends React.Component {

  submitForm (siteParams) {
    this.props.editSite(
      this.props.site.get('id'),
      siteParams
    ).then(this.props.onSuccess)
  }

  render () {
    const error = this.props.editingSiteError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
        [error.key]: msgFromError(error),
    } : {}

    const handleSubmit = this.props.handleSubmit

    return (
      <Row>
        <Col sm={6}>
          <form onSubmit={handleSubmit(this.submitForm.bind(this))}>

            <FormGroup color={errors.background ? 'danger' : ''}>
              <Label for="background">Background</Label>
              <Field
                props={{ state: (errors.background ? 'danger' : '') }}
                name="background"
                id="background"
                component={renderInputField}
                type="textarea"
              />
              <FormFeedback>{errors.background}</FormFeedback>
            </FormGroup>

            <FormGroup color={errors.summary ? 'danger' : ''}>
              <Label for="summary">Executive Summary</Label>
              <Field
                props={{ state: (errors.summary ? 'danger' : '') }}
                name="summary"
                id="summary"
                component={renderInputField}
                type="textarea"
              />
              <FormFeedback>{errors.summary}</FormFeedback>
            </FormGroup>

            <FormGroup color={errors.history ? 'danger' : ''}>
              <Label for="history">History</Label>
              <Field
                props={{ state: (errors.history ? 'danger' : '') }}
                name="history"
                id="history"
                component={renderInputField}
                type="textarea"
              />
              <FormFeedback>{errors.history}</FormFeedback>
            </FormGroup>

            <Button
              color="primary"
              disabled={this.props.editingSite}
            >Save</Button>
          </form>
        </Col>
      </Row>
    )
  }
}


EditExecutiveSummaryForm = reduxForm({
  form: 'executivesummary'
})(EditExecutiveSummaryForm)

const mapStateToProps = (store, props) => ({
  site: props.site,
  onSuccess: props.onSuccess,
  initialValues: {
    history: props.site.get('history', ''),
    background: props.site.get('background', ''),
    summary: props.site.get('summary', ''),
  },
  editingSiteError: store.get('editingSiteError'),
  editingSite: store.get('editingSite'),
})

const mapDispatchToProps = (dispatch, props) => ({
  editSite: (id, site) => dispatch(editSite(id, site)),
  clearEditingSiteError: () => dispatch(clearEditingSiteError()),
})

 EditExecutiveSummaryForm = connect(mapStateToProps, mapDispatchToProps)(EditExecutiveSummaryForm)


export default EditExecutiveSummaryForm
