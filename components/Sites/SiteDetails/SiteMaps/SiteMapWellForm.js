
import React from 'react'

import {
    Button,
    Form,
} from 'reactstrap'

import {
  Field,
  reduxForm,
} from 'redux-form/immutable'
import SelectFormGroup from 'components/shared/ReduxFormHelpers/SelectFormGroup'

class SiteMapWellForm extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { handleSubmit } = this.props

    const selectOptions = this.props.wells.map((well) => (
      <option value={well.get('id')}>{well.get('title')}</option>
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


export default reduxForm({form: 'siteMapWellForm'})(SiteMapWellForm)
