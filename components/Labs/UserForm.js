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
import IndividualFormGroup from '../shared/ReduxFormHelpers/IndividualFormGroup'

const UserForm = (props) => {
  const { currentRole, handleSubmit, onSubmit } = props
  return (
    <Col sm="6">
      <h6>Add {currentRole.get('description')}</h6>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <InputGroup>
            <Field
              name='title'
              id='title'
              component={Input}
              type='text'
            />
          </InputGroup>
          <InputGroupButton>
            <Button color="primary" className="pointer">
              Invite
            </Button>
          </InputGroupButton>
        </FormGroup>
      </Form>
    </Col>
  )
}

export default reduxForm({form: 'labUserForm'})(UserForm)
