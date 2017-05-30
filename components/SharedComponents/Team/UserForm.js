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

const UserForm = (props) => {
  const { currentRole, handleSubmit, onSubmit } = props
  if (!currentRole) { return null }

  return (
    <div>
      <h6>Add {currentRole.get('description')}</h6>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <InputGroup>
            <Field
              name='email'
              id='email'
              component={(field) => (<Input
                { ...field.input}
                type={field.type}
                state={field.state}
                id={field.id} />)}
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
