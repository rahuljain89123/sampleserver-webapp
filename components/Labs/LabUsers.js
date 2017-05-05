
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

import UsersTable from './UsersTable'
import UserForm from './UserForm'

import { createUser, fetchUsers } from 'actions/users'
import { currentUserRole } from 'normalizers'


class LabUsers extends React.Component {
  constructor (props) {
    super(props)
    const roles = props.roles
    this.onSubmit = this.onSubmit.bind(this)

    const activeRole = roles.size ? roles.first().get('id') : 100
    this.state = {
      activeRole,
    }
  }

  componentDidMount () {
    this.props.fetchUsers({ lab_id: this.props.lab.get('id') })
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

const mapStateToProps = (state, props) => {
  const cUserRole = currentUserRole(state, 100)

  const roles = state.get('roles')
    .filter(role => role.get('id') === 2 || role.get('id') === 3)
    .filter(role => role.get('id') >= cUserRole.get('id'))
    .sort((a, b) => a.get('id') - b.get('id'))

  const users = state.get('users')
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
})

export default connect(mapStateToProps, mapDispatchToProps)(LabUsers)
