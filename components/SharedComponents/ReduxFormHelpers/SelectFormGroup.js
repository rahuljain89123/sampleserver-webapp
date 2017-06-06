import React from 'react'
import {
  FormGroup,
  FormFeedback,
  Input,
  Label,
  Row,
  Col,
} from 'reactstrap'

const SelectFormGroup = (field) => (
  <FormGroup className={field.location == 'sidebar' ? 'sidebar-form-group' : 'row'} color={field.error ? 'danger' : ''}>
    {field.label && <label className={field.location == 'sidebar' ? 'col-form-label' : 'col-sm-2 col-form-label'}>{field.label}</label>}
    <div className={field.location == 'sidebar' ? 'sidebar-form-group-inner' : 'col-sm-9'}>
      <Input
        { ...field.input}
        type='select'
        state={field.state}
        id={field.id}
      >
        {field.placeholder && <option value=''>{field.placeholder}</option>}
        {field.options}
      </Input>
    </div>
    <FormFeedback> {field.error} </FormFeedback>
  </FormGroup>
)

export default SelectFormGroup
