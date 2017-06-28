
import React from 'react'
import {
  FormGroup,
  FormFeedback,
  Input,
  Label,
  Row,
  Col,
} from 'reactstrap'

const IndividualFormGroup = (field) => (
  <FormGroup
    row
    check={field.type === 'checkbox'}
    color={field.error ? 'danger' : ''}
    className={field.type === 'checkbox' ? 'pl-4' : ''}>
    { field.type !== 'checkbox' && <Label sm={2} for={field.id}> {field.label} </Label> }
    <Col sm={field.gridWidth ? field.gridWidth : 9}>
      <Input
        {...field.input}
        type={field.type}
        state={field.state}
        id={field.id}
      />
      <FormFeedback> {field.error} </FormFeedback>
    </Col>
    { field.type === 'checkbox' && <Label for={field.id}> {field.label} </Label> }
  </FormGroup>
)


export default IndividualFormGroup
