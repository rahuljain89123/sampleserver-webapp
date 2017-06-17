
import React from 'react'
import Immutable from 'immutable'
import classnames from 'classnames'
import { connect } from 'react-redux'
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from 'reactstrap'

import UsersTable from 'SharedComponents/Team/UsersTable'
import UserForm from 'SharedComponents/Team/UserForm'

import { fetchCompany } from 'actions/companies'
import { createUser, fetchUsers, editUser } from 'actions/users'
import { currentUserRole } from 'normalizers'
import { flashMessage, setHeaderInfo } from 'actions/global'

import { msgFromError } from 'helpers/util'

class CompanyUsers extends React.Component {
  constructor (props) {
    super(props)
    const roles = props.roles

    const activeRole = roles.size ? roles.first().get('id') : 100

    this.onSubmit = this.onSubmit.bind(this)
    this.onInviteUser = this.onInviteUser.bind(this)
    this.hideModal = this.hideModal.bind(this)

    this.state = {
      activeRole,
      invitingUser: false,
      error: false,
    }
  }

  onInviteUser () {
    this.setState({ invitingUser: true })
  }

  hideModal () {
    this.setState({ invitingUser: false })
  }

  componentDidMount () {
    this.props.fetchUsers({ companies: this.state.companyId })

    if (!this.state.company) {
      this.props.fetchCompany(this.state.companyId)
    }

    this.props.setHeaderInfo(
      'Dashboard',
      [{
        text: 'Project',
        onClick: '/app/projects/new',
        iconName: 'add_circle_outline',
      },
      {
        text: 'Site',
        onClick: '/app/sites/new',
        iconName: 'add_circle_outline',
      }],
    )
  }

  onToggle (activeRole) {
    this.setState({ activeRole })
  }

  clearError () {
    this.setState({ error: false })
  }

  onSubmit (userParams) {
    const user = {
      email: userParams.get('email'),
      lab_id: this.props.lab.get('id'),
      role_id: this.state.activeRole,
      companies: {
        add: [this.props.company.get('id')],
        remove: [],
      },
    }

    this.props.createUser(user)
    .then(() => {
      this.clearError()
      this.setState({ invitingUser: false })
      this.props.flashMessage('success', 'User invited successfully.')
    })
    .catch((error) => {
      this.props.flashMessage('danger', msgFromError(error))
      this.setState({ error: msgFromError(error) })
    })
  }

  render () {
    const { activeRole } = this.state
    const currentRole = this.props.roles.size ? this.props.roles.get(activeRole) : null
    const company = this.props.currentCompany

    if (!company) {
      return null
    }

    const users = this.props.users
      .filter(user => user.get('role_id') === activeRole)
      .entrySeq()
    const roles = this.props.roles.entrySeq()

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
      <div className="company-users">
        <Nav tabs>
          {roles.map(([id, role]) => (
            <NavItem key={role.get('id')}>
              <NavLink
                className={classnames({
                  pointer: true,
                  active: this.state.activeRole === id,
                })}
                onClick={() => this.onToggle(id)}
              >
                {`${role.get('description')}s`}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <div className="nav-item action">
          <a className="nav-link" onClick={this.onInviteUser}><i className="material-icons">person_add</i> Invite {currentRole.get('description')}</a>
        </div>
        <TabContent activeTab={this.state.activeRole} style={{ marginTop: 20 }}>
          <TabPane tabId={4}>
            <Row>
              <Col sm="12">
                <p>
                Can create additional CompanyAdmin Users.
                </p>
                <p>
                Can disable other CompanyAdmin users.
                </p>
                <p>
                Cannot disable their own account.
                </p>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId={5}>
            <Row>
              <Col sm="12">
                <p>
                Can create/edit/view all sites within the company.
                </p>
                <p>
                Can create site groups.
                </p>
                <p>
                Can add project managers and technicians to each site group.
                </p>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
        <UsersTable users={users} />
        <Modal isOpen={this.state.invitingUser} toggle={this.hideModal}>
          <ModalHeader toggle={this.hideModal}>Invite {currentRole.get('description')}</ModalHeader>
          <ModalBody>
            {errorDisplay}
            <UserForm
              currentRole={currentRole}
              onSubmit={this.onSubmit} />
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (store, ownProps) => {
  const cURole = currentUserRole(store, 100)

  const roles = store.get('roles')
    .filter(role => role.get('id') === 4 || role.get('id') === 5)
    .filter(role => role.get('id') >= cURole.get('id'))
    .sort((a, b) => a.get('id') - b.get('id'))

  const companyId = ownProps.currentCompany.get('id')
  const company = store.get('companies').get(companyId)

  const users = store.get('users')
    .filter((user) => user.get('company_ids').includes(companyId))

  return {
    currentUserRole: cURole,
    users,
    roles,
    company,
  }
}

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  fetchCompany: id => dispatch(fetchCompany(id)),
  fetchUsers: filters => dispatch(fetchUsers(filters)),
  createUser: user => dispatch(createUser(user)),
  editUser: (id, user) => dispatch(editUser(id, user)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyUsers)
