
import React from 'react'
import { connect } from 'react-redux'
import { Route, NavLink } from 'react-router-dom'
import {
  Row,
  Col,
  Nav,
  NavItem,
} from 'reactstrap'

import { fetchClient } from '../../actions/clients'
import EditClientForm from './EditClientForm'
import ClientUsers from './ClientUsers'
import { setHeaderInfo } from 'actions/global'


class Client extends React.Component {
  constructor (props) {
    super(props)

    const clientId = parseInt(props.match.params.id, 10)
    const client = props.clients.get(clientId)

    this.state = {
      clientId,
      client,
    }
  }

  componentDidMount () {
    if (!this.state.client) {
      this.props.fetchClient(this.state.clientId)
    }

    this.props.setHeaderInfo(
      'Edit Client'
    )
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      client: nextProps.clients.get(this.state.clientId),
    })
  }

  onClick (e) {
    e.preventDefault()
    this.props.push(e.target.getAttribute('href'))
  }

  render () {
    const client = this.state.client

    if (!client) {
      return null
    }

    return (
      <div className="manage-client has-navbar">
        <Nav tabs>
          <NavItem>
            <NavLink
              exact
              to={`/app/clients/${client.get('id')}`}
              className="nav-link"
              activeClassName="active"
            >Details</NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              exact
              to={`/app/clients/${client.get('id')}/users`}
              className="nav-link"
              activeClassName="active"
            >Manage Users</NavLink>
          </NavItem>
        </Nav>
        <Route
          exact
          path="/app/clients/:id"
          render={() => (
            <Row>
              <Col sm={6}>
                <EditClientForm client={client} push={this.props.push} />
              </Col>
            </Row>
          )}
        />
        <Route
          exact
          path="/app/clients/:id/users"
          component={ClientUsers}
        />
      </div>
    )
  }
}

const mapStateToProps = store => ({
  clients: store.get('clients'),
})

const mapDispatchToProps = dispatch => ({
  fetchClient: id => dispatch(fetchClient(id)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Client)
