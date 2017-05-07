import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'

import {
  Button,
  Form,
} from 'reactstrap'
import IndividualFormGroup from 'SharedComponents/ReduxFormHelpers/IndividualFormGroup'

const SiteActivityReportForm = (props) => {
  const { handleSubmit, onSubmit } = props
  const error = props.editingScheduleError

  const errors = error && error.key ? {
      [error.key]: msgFromError(error),
  } : {}
  return (<Form onSubmit={handleSubmit(onSubmit)}>
    <Field
      props={{ error: errors.date, label: 'Date' }}
      name='date'
      id='date'
      component={IndividualFormGroup}
      type='text'
    />

    <Field
      props={{ error: errors.date, label: 'Time of Day' }}
      name='timeofday'
      id='timeofday'
      component={IndividualFormGroup}
      type='text'
    />

    <Field
      props={{ error: errors.date, label: 'Start Time' }}
      name='starttime'
      id='starttime'
      component={IndividualFormGroup}
      type='text'
    />

    <Field
      props={{ error: errors.date, label: 'End Time' }}
      name='endtime'
      id='endtime'
      component={IndividualFormGroup}
      type='text'
    />

    <Field
      props={{ error: errors.date, label: 'Type Of Activity' }}
      name='typeofactivity'
      id='typeofactivity'
      component={IndividualFormGroup}
      type='text'
    />

    <Field
      props={{ error: errors.date, label: 'Release Number' }}
      name='release_number'
      id='release_number'
      component={IndividualFormGroup}
      type='text'
    />

    <Button
      color="primary"
      disabled={this.props.editingSchedule}>
      Save
    </Button>

  </Form>)
}


export default reduxForm({form: 'site_activity_report'})(SiteActivityReportForm)
