 
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
} from 'reactstrap'

import { Field, reduxForm } from 'redux-form/immutable'
import DraftJSFormGroup from '../../../shared/ReduxFormHelpers/DraftJSFormGroup'
import { msgFromError } from '../../../../util'

class EditExecutiveSummaryForm extends React.Component {
  constructor (props) {
      super(props)

      this.state = {
          successMessage: false,
      }
  }

  submitForm (siteParams) {
    this.props.editSite(
      this.props.site.get('id'),
      siteParams
    ).then(this.onSuccess())
  }

  onSuccess (params) {
    this.setState({
      successMessage: "Saved!"
    })
    setTimeout(function() {
        this.setState({successMessage: false})
    }.bind(this), 3000);
  }

  render () {
    const error = this.props.editingSiteError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
        [error.key]: msgFromError(error),
    } : {}

    const { handleSubmit } = this.props

    return (
      <Row>
        <Col sm={8}>
          <Form onSubmit={handleSubmit(this.submitForm.bind(this))}>

            <Field
              props={{ error: errors.background, label: 'Background' }}
              name="background"
              id="background"
              component={DraftJSFormGroup}
            />

            <Field
              props={{ error: errors.summary, label: 'Executive Summary' }}
              name="summary"
              id="summary"
              component={DraftJSFormGroup}
            />

            <Field
              props={{ error: errors.history, label: 'History' }}
              name="history"
              id="history"
              component={DraftJSFormGroup}
            />

            <Button
              color="primary"
              disabled={this.props.editingSite}
            >Save</Button>
            {this.state.successMessage ? (
              <p>{this.state.successMessage}</p>
            ) : ''}
          </Form>
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
