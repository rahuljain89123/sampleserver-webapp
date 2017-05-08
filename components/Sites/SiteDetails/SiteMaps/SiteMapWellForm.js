
import React from 'react'

import {
    Button,
    Form,
} from 'reactstrap'
import {
  Field,
  reduxForm,
  change,
} from 'redux-form/immutable'

import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'

const FORM_NAME = 'siteMapWellForm'

class SiteMapWellForm extends React.Component {
  componentDidMount () {
    this.props.dispatch(change(
      FORM_NAME,
      'well_id', this.props.wells.first().get('id')
    ))
  }

  render () {
    const { handleSubmit } = this.props

    const selectOptions = this.props.wells.map((well) => (
      <option key={well.get('id')} value={well.get('id')}>{well.get('title')}</option>
    ))

    return (
      <Form className="gray" onSubmit={handleSubmit(this.props.onSubmit)}>
        <Field
          props={{ label: 'Well Id'}}
          name='well_id'
          id='well_id'
          component={SelectFormGroup}
          options={selectOptions}
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

export default reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(SiteMapWellForm)
