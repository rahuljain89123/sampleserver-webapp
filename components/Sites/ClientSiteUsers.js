
import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import {
  Table,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupButton,
  Badge,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from 'reactstrap'

import UsersTable from 'SharedComponents/Team/UsersTable'
import UserForm from 'SharedComponents/Team/UserForm'

import { fetchSite } from 'actions/sites'
import { createUser, fetchUsers } from 'actions/users'
import { flashMessage,setHeaderInfo } from 'actions/global'
import { currentLab, safeGet } from 'normalizers'
import { msgFromError } from 'helpers/util'

const TECHNICIAN_ROLE = 7


class ClientSiteUsers extends React.Component {
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

    this.props.fetchUsers({ sites: this.props.site.get('id') })
    this.props.setHeaderInfo(
      `${this.props.roles.get(TECHNICIAN_ROLE).get('description')}s`
    )
  }

  onInviteUser (e) {
    e.preventDefault()
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
      email: userParams.get('email'),
      lab_id: this.props.lab.get('id'),
      role_id: TECHNICIAN_ROLE,
      sites: {
        add: [this.props.site.get('id')],
        remove: [],
      },
    }

    this.props.createUser(user)
      .then(() => {
        this.clearError()
        this.setState({ invitingUser: false })
        this.props.flashMessage('success', 'User added successfully')
        this.props.fetchSite(this.props.site.get('id'))
        window.analytics.track('user invited', {
          user: user,
        })
      })
      .catch(e => {
        this.props.flashMessage('danger', msgFromError(e))
        this.setState({ error: msgFromError(e) })
        window.analytics.track('user invite error', {
          user: user,
          error: e,
        })
      })
  }

  render () {
    const filteredUsers = this.props.site.get('user_ids')
      .map(id => this.props.users.get(id))
      .filter((user) => user && user.get('role_id') === TECHNICIAN_ROLE)
      .entrySeq()

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

    let techniciansTable = null
    let techniciansNav =  null
    if (!filteredUsers.size) {
      techniciansTable = (<div>No technicians yet. <a href='#' onClick={this.onInviteUser}>Add Technician.</a></div>)
    } else {
      techniciansTable = <UsersTable users={filteredUsers} />
      techniciansNav = (<div>
        <div className="nav-item action">
          <a className="nav-link invite-users" onClick={this.onInviteUser}><i className="material-icons">person_add</i> Invite Technican</a>
        </div>
        <Row>
          <Col sm="12">
            <p>
              Can view/edit sites only for data input purposes.<br />
              Cannot create a new site.<br /><br />
            </p>
          </Col>
        </Row>
      </div>)
    }

    return (
      <div className="client-site-users has-navbar">
        { techniciansNav }
        { techniciansTable }
        <Modal isOpen={this.state.invitingUser} toggle={this.hideModal}>
          <ModalHeader toggle={this.hideModal}>Invite Technican</ModalHeader>
          <ModalBody>
            {errorDisplay}
            <UserForm
              currentRole={this.props.roles.get(TECHNICIAN_ROLE)}
              onSubmit={this.onSubmit}
            />
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (store, props) => {

  return {
    users: store.get('users'),
    roles: store.get('roles'),
    lab: currentLab(store),
  }
}

const mapDispatchToProps = dispatch => ({
  fetchSite: siteId => dispatch(fetchSite(siteId)),
  fetchUsers: filters => dispatch(fetchUsers(filters)),
  createUser: user => dispatch(createUser(user)),
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  setHeaderInfo: (text, buttons) => dispatch(setHeaderInfo(text, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientSiteUsers)
