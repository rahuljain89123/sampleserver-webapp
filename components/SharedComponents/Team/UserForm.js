import React from 'react'
import {
  Form,
  Col,
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupButton,
} from 'reactstrap'

import { Field, reduxForm } from 'redux-form/immutable'
import IndividualFormGroup from 'SharedComponents/ReduxFormHelpers/IndividualFormGroup'
import IndividualInput from 'SharedComponents/ReduxFormHelpers/IndividualInput'

const UserForm = (props) => {
  const { currentRole, handleSubmit, onSubmit } = props
  if (!currentRole) { return null }

  return (
    <div>
      <h6>Add {currentRole.get('description')}</h6>
      <Form onSubmit={handleSubmit(onSubmit)} className="user-form">
        <FormGroup>
          <InputGroup>
            <Field
              name='email'
              id='email'
              component={IndividualInput}
              type='text'
            />
            <InputGroupButton>
              <Button color="primary" className="pointer">
                Invite
              </Button>
            </InputGroupButton>
          </InputGroup>

        </FormGroup>
      </Form>
    </div>
  )
}

export default reduxForm({form: 'labUserForm'})(UserForm)
