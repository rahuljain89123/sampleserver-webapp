
import React from 'react'
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
} from 'reactstrap'

import UsersTable from 'SharedComponents/Team/UsersTable'
import UserForm from 'SharedComponents/Team/UserForm'

import { createUser, fetchUsers } from 'actions/users'
import { currentUserRole } from 'normalizers'
import { flashMessage, setHeaderInfo } from 'actions/global'

import { msgFromError } from 'helpers/util'

class LabUsers extends React.Component {
  constructor (props) {
    super(props)
    const roles = props.roles

    const activeRole = roles.size ? roles.first().get('id') : 100
    this.state = {
      activeRole,
    }

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    window.analytics.page()
    this.props.fetchUsers({ lab_id: this.props.lab.get('id') })
    this.props.setHeaderInfo('Manage Team')
  }

  onToggle (activeRole) {
    this.setState({ activeRole })
  }

  onSubmit (userParams) {
    const user = {
      email: userParams.get('email'),
      lab_id: this.props.lab.get('id'),
      role_id: this.state.activeRole,
    }

    this.props.createUser(user)
      .then(() => {
        this.props.flashMessage('success', 'User invited successfully.')
        window.analytics.track('user invited', {
          user: user,
        })
      })
      .catch((e) => {
        this.props.flashMessage('danger', msgFromError(e))
        window.analytics.track('user invite error', {
          user: user,
          error: e,
        })
      })
  }

  render () {
    const { activeRole } = this.state
    const currentRole = this.props.roles.size ? this.props.roles.get(activeRole) : null

    const users = this.props.users
      .filter(user => user.get('role_id') === activeRole)
      .entrySeq()
    const roles = this.props.roles.entrySeq()

    return (
      <div>
        <Nav tabs>
          {roles.map(([id, role]) => (
            <NavItem key={role.get('id')}>
              <NavLink
                className={classnames({
                  pointer: true,
                  active: activeRole === id,
                })}
                onClick={() => this.onToggle(id)}
              >
                {`${role.get('description')}s`}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <TabContent activeTab={activeRole} style={{ marginTop: 20 }}>
          <TabPane tabId={2}>
            <Row>
              <Col sm="12">
                <p>
                Can view/edit all sites created and managed under this Lab.<br />
                Can create and disable Lab Associates.<br /><br />
                </p>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId={3}>
            <Row>
              <Col sm="12">
                <p>
                  Can receive samples.<br />
                  Can create new sites and enter data.<br />
                  Cant delete sites/accounts or access billing info.<br /><br />
                </p>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
        <UsersTable users={users} />
        <Row>
          <UserForm
            currentRole={currentRole}
            onSubmit={this.onSubmit} />
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (store, props) => {
  const cUserRole = currentUserRole(store, 100)

  const roles = store.get('roles')
    .filter(role => role.get('id') === 2 || role.get('id') === 3)
    .filter(role => role.get('id') >= cUserRole.get('id'))
    .sort((a, b) => a.get('id') - b.get('id'))

  const users = store.get('users')
    .filter(user =>
      user.get('lab_id') === props.lab.get('id'))
    .sort((a, b) => a.get('id') - b.get('id'))

  return {
    users,
    roles,
    currentUserRole: cUserRole,
  }
}

const mapDispatchToProps = dispatch => ({
  fetchUsers: filters => dispatch(fetchUsers(filters)),
  createUser: user => dispatch(createUser(user)),
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  setHeaderInfo: (text, buttons) => dispatch(setHeaderInfo(text, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LabUsers)
