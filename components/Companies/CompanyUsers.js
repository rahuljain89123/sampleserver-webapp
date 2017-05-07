
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
} from 'reactstrap'

import UsersTable from 'SharedComponents/team/UsersTable'
import UserForm from 'SharedComponents/team/UserForm'

import { fetchCompany } from 'actions/companies'
import { createUser, fetchUsers, editUser } from 'actions/users'
import { currentUserRole } from 'normalizers'


class CompanyUsers extends React.Component {
  constructor (props) {
    super(props)
    const roles = props.roles

    const activeRole = roles.size ? roles.first().get('id') : 100

    this.onSubmit = this.onSubmit.bind(this)

    this.state = {
      activeRole,
    }
  }

  componentDidMount () {
    this.props.fetchUsers({ companies: this.state.companyId })

    if (!this.state.company) {
      this.props.fetchCompany(this.state.companyId)
    }
  }

  onToggle (activeRole) {
    this.setState({ activeRole })
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
  }

  toggleActive (user) {
    this.props.editUser(user.get('id'), {
      active: !user.get('active'),
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

    return (
      <div>
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
        <TabContent activeTab={this.state.activeRole} style={{ marginTop: 20 }}>
          <TabPane tabId={4}>
            <Row>
              <Col sm="12">
                <p>
                Can create additional CompanyAdmin Users.
                <br />
                CompanyAdmin users can disable other CompanyAdmin users.
                <br />
                CompanyAdmin cannot disable himself.
                <br />
                All CompanyAdmins receive notification the invoice,
                and all have the ability to pay.
                <br />
                Also have CompanyAssociate permissions.
                <br /><br />
                </p>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId={5}>
            <Row>
              <Col sm="12">
                <p>
                Can create/edit/view all sites within the company.
                <br />
                Can create site groups.
                <br />
                Can add project managers and technicians to each site group.
                <br /><br />
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
  fetchCompany: id => dispatch(fetchCompany(id)),
  fetchUsers: filters => dispatch(fetchUsers(filters)),
  createUser: user => dispatch(createUser(user)),
  editUser: (id, user) => dispatch(editUser(id, user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyUsers)
