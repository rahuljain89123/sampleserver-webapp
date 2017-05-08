
import React from 'react'

import {
  FormGroup,
  FormFeedback,
  Input,
  Label,
} from 'reactstrap'

import RichTextEditor from 'react-rte'

class DraftJSFormGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: RichTextEditor.createValueFromString(this.props.input.value, 'html')
    }
  }

  handleChange (value) {
    this.setState({ value })
    const html = value.toString('html')

    this.props.input.onChange(html)
  }

  render () {
    const {  state: { value }, handleChange } = this
    const { id, label, onBlur } = this.props

    return (<FormGroup>
      <Label for={id}> {label} </Label>
      <RichTextEditor
        editorClassName="rich-text-editor"
        value={value}
        onChange={handleChange.bind(this)}
        onBlur={onBlur}
      />
    </FormGroup>)
  }
}

export default DraftJSFormGroup
