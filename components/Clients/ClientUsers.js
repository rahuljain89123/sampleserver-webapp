
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
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from 'reactstrap'

import UsersTable from 'SharedComponents/Team/UsersTable'
import UserForm from 'SharedComponents/Team/UserForm'

import { fetchClient } from 'actions/clients'
import { createUser, fetchUsers } from 'actions/users'
import { flashMessage } from 'actions/global'

import { msgFromError } from 'helpers/util'

import { CLIENT_MANAGER_ROLE_ID } from 'constants/database/RoleIds'

class ClientUsers extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.onInviteUser = this.onInviteUser.bind(this)
    this.hideModal = this.hideModal.bind(this)

    this.state = {
      invitingUser: false,
      error: false,
    }
  }

  componentDidMount () {
    this.props.fetchUsers({ clients: this.props.clientId })
    this.props.fetchClient(this.props.clientId)
  }

  onInviteUser () {
    this.setState({ invitingUser: true })
  }

  hideModal () {
    this.setState({ invitingUser: false })
  }

  clearError () {
    this.setState({ error: false })
  }

  onSubmit (userParams) {
    const user = {
      email: userParams.get('email') ? userParams.get('email').trim() : '',
      role_id: CLIENT_MANAGER_ROLE_ID,
      clients: {
        add: [this.props.client.get('id')],
        remove: [],
      },
    }

    this.props.createUser(user)
      .then(() => {
        this.clearError()
        this.setState({ invitingUser: false })
        this.props.flashMessage('success', 'User invited successfully.')
        // Need to fetch client to update client's user_ids
        this.props.fetchClient(this.props.clientId)
      })
      .catch(e => {
        this.props.flashMessage('danger', msgFromError(e))
        this.setState({ error: msgFromError(e) })
      })
  }

  render () {
    const client = this.props.client

    if (!client) {
      return null
    }

    const users = this.props.users.entrySeq()
    const role = this.props.role

    let errorDisplay = null
    if (this.state.error) {
      errorDisplay = (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <button type="button" className="close" onClick={() => this.clearError()}>
            <span aria-hidden="true">&times;</span>
          </button>
          {this.state.error}
        </div>
      )
    }

    return (
      <div className="client-users">
        <div className="nav-item action">
          <a className="nav-link invite-users" onClick={this.onInviteUser}><i className="material-icons">person_add</i> Invite {role.get('description')}</a>
        </div>
        <UsersTable users={users} />
        <Modal isOpen={this.state.invitingUser} toggle={this.hideModal}>
          <ModalHeader toggle={this.hideModal}>Invite {role.get('description')}</ModalHeader>
          <ModalBody>
            {errorDisplay}
            <UserForm
              currentRole={role}
              onSubmit={this.onSubmit}
            />
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (store, props) => {
  const role = store.get('roles').size ?
    store.get('roles').get(CLIENT_MANAGER_ROLE_ID) : null

  const clientId = parseInt(props.match.params.id, 10)
  const client = store.get('clients').get(clientId)

  const users = store.get('users')
    .filter(user => client.get('user_ids').includes(user.get('id')))
    .filter(user => user.get('role_id') === CLIENT_MANAGER_ROLE_ID)
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
