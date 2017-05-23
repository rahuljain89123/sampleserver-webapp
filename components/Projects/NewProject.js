
import React from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
} from 'reactstrap'
import NewProjectForm from './NewProjectForm'
import { setHeaderInfo } from 'actions/global'


class NewProject extends React.Component {
  componentDidMount () {
    this.props.setHeaderInfo(
      'New Project',
      [{
        text: 'Site',
        onClick: '/app/sites/new',
        iconName: 'add_circle_outline',
      }],
    )
  }

  render () {
    return (
      <div>
        <Row>
          <Col sm={6}>
            <NewProjectForm push={this.props.push} />
          </Col>
        </Row>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(null, mapDispatchToProps)(NewProject)
