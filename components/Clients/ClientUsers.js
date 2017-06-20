
import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import {
  Table,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupButton,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap'

import UsersTable from 'SharedComponents/Team/UsersTable'
import UserForm from 'SharedComponents/Team/UserForm'

import { fetchClient } from 'actions/clients'
import { createUser, fetchUsers } from 'actions/users'
import { flashMessage } from 'actions/global'

import { msgFromError } from 'helpers/util'

const PROJECT_MANAGER_ROLE = 6


class ClientUsers extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    this.props.fetchUsers({ clients: this.props.clientId })
    this.props.fetchClient(this.props.clientId)
  }

  onSubmit (userParams) {
    const user = {
      email: userParams.get('email') ? userParams.get('email').trim() : '',
      role_id: PROJECT_MANAGER_ROLE,
      clients: {
        add: [this.props.client.get('id')],
        remove: [],
      },
    }

    this.props.createUser(user)
      .then(() => {
        this.props.flashMessage('success', 'User invited successfully.')
        // Need to fetch client to update client's user_ids
        this.props.fetchClient(this.props.clientId)
      })
      .catch(e => this.props.flashMessage('danger', msgFromError(e)))
  }

  render () {
    const client = this.props.client

    if (!client) {
      return null
    }

    const users = this.props.users.entrySeq()
    const role = this.props.role

    return (
      <div>
        <UsersTable users={users} />
        <Row>
          <UserForm
            currentRole={role}
            onSubmit={this.onSubmit}
          />
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (store, props) => {
  const role = store.get('roles').size ?
    store.get('roles').get(PROJECT_MANAGER_ROLE) : null

  const clientId = parseInt(props.match.params.id, 10)
  const client = store.get('clients').get(clientId)

  const users = store.get('users')
    .filter(user => client.get('user_ids').includes(user.get('id')))
    .filter(user => user.get('role_id') === PROJECT_MANAGER_ROLE)
    .sort((a,b) => a.get('id') - b.get('id'))

  return {
    clientId,
    users,
    role,
    client,
  }
}

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  fetchClient: id => dispatch(fetchClient(id)),
  fetchUsers: filters => dispatch(fetchUsers(filters)),
  createUser: user => dispatch(createUser(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientUsers)