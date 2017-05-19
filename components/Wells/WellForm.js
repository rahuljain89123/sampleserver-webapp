
import React from 'react'

import {
  Button,
  Form,
} from 'reactstrap'

import { Field, reduxForm } from 'redux-form/immutable'
import IndividualFormGroup from 'SharedComponents/ReduxFormHelpers/IndividualFormGroup'

import { msgFromError } from 'helpers/util'

class WellForm extends React.Component {

  componentWillMount () {
    if (this.props.wellError) {
      this.props.clearWellError()
    }
  }

  render () {
    const error = this.props.wellError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
      [error.key]: msgFromError(error),
    } : {}

    const { handleSubmit, submitForm } = this.props

    return (
      <Form onSubmit={handleSubmit(submitForm)}>
        <Field
          props={{ error: errors.title, label: 'Well/Sample ID'}}
          name='title'
          id='title'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.top_of_casing, label: 'Top of Casing Elevation'}}
          name='top_of_casing'
          id='top_of_casing'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.diameter, label: 'Well Diameter (inches)'}}
          name='diameter'
          id='diameter'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.material, label: 'Well Material'}}
          name='material'
          id='material'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.screenlength, label: 'Screen Length (ft)'}}
          name='screenlength'
          id='screenlength'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.sampletechnique, label: 'Sampling Technique'}}
          name='sampletechnique'
          id='sampletechnique'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.latitude, label: 'GPS Latitude (decimal)'}}
          name='latitude'
          id='latitude'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.longitude, label: 'GPS Longitude (decimal)'}}
          name='longitude'
          id='longitude'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.est_depth_to_water, label: 'Predicted Depth to Water (ft)'}}
          name='est_depth_to_water'
          id='est_depth_to_water'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.depth_to_bottom, label: 'Measured Depth to Bottom (ft)'}}
          name='depth_to_bottom'
          id='depth_to_bottom'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.purge_water_disposal, label: 'Well Sampling Purge Water Disposal'}}
          name='purge_water_disposal'
          id='purge_water_disposal'
          component={IndividualFormGroup}
          type='text'
        />

        <Field
          props={{ error: errors.notes, label: 'Well Notes'}}
          name='notes'
          id='notes'
          component={IndividualFormGroup}
          type='text'
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

WellForm = reduxForm({ form: 'wellform' })(WellForm)

export default WellForm
