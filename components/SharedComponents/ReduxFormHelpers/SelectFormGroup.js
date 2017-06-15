import React from 'react'
import {
  FormGroup,
  FormFeedback,
  Input,
  Label,
  Row,
  Col,
} from 'reactstrap'
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const SelectFormGroup = (field) => (
  <FormGroup className={field.location == 'sidebar' ? 'sidebar-form-group' : 'row'} color={field.error ? 'danger' : ''}>
    {field.label && <label className={field.location == 'sidebar' ? 'col-form-label' : 'col-sm-2 col-form-label'}>{field.label}</label>}
    <div className={field.location == 'sidebar' ? 'sidebar-form-group-inner' : 'col-sm-9'}>
      <Select
        onChange={(v) => field.input.onChange(v.value)}
        value={field.input.value}
        name={field.input.name}
        id={field.id}
        options={field.options}
        placeholder={field.placeholder}
      />

    </div>
    <FormFeedback> {field.error} </FormFeedback>
  </FormGroup>
)

export default SelectFormGroup
