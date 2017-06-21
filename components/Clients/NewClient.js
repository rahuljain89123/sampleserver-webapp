
import React from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
} from 'reactstrap'
import NewClientForm from './NewClientForm'
import { setHeaderInfo } from 'actions/global'


class NewClient extends React.Component {
  componentDidMount () {
    this.props.setHeaderInfo(
      'New Client',
      [{
        text: 'Site',
        onClick: '/app/sites/new',
        iconName: 'add_circle_outline',
      }],
    )
  }

  render () {
    return (
      <div className="new-client has-navbar">
        <Row>
          <Col sm={12} md={8}>
            <NewClientForm push={this.props.push} />
          </Col>
        </Row>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(null, mapDispatchToProps)(NewClient)
