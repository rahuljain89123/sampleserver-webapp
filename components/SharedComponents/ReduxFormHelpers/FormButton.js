import React from 'react'
import {
  FormGroup,
  FormFeedback,
  Input,
  Label,
  Row,
  Col,
  Button,
} from 'reactstrap'


class FormButton extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div className="row form-button-row">
        <div className="col-sm-9 offset-sm-2">
          <Button
            role={this.props.role}
            color={this.props.color}
            disabled={this.props.disabled}
          >Save</Button>
        </div>
      </div>
    )
  }
}


export default FormButton
