
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
} from 'reactstrap'

import UsersTable from 'SharedComponents/Team/UsersTable'
import UserForm from 'SharedComponents/Team/UserForm'

import { fetchSite } from 'actions/sites'
import { createUser, fetchUsers } from 'actions/users'
import { flashMessage } from 'actions/global'
import { currentLab, safeGet } from 'normalizers'

const TECHNICIAN_ROLE = 7

class ProjectSiteUsers extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    this.props.fetchUsers({ sites: this.props.site.get('id') })
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
        this.props.flashMessage('success', 'User added successfully')
        this.props.fetchSite(this.props.site.get('id'))
      })
      .catch(() => this.props.flashMessage('STANDARD_ERROR'))
  }

  render () {
    const filteredUsers = this.props.site.get('user_ids')
      .map(id => this.props.users.get(id))
      .filter((user) => user && user.get('role_id') === TECHNICIAN_ROLE)
      .entrySeq()

    return (
      <div>
        <h2 className="border-bottom">{`${this.props.roleDescription}s`}</h2>
        <Row style={{ marginTop: 20 }}>
          <Col sm="12">
            <p>
              Can view/edit sites only for data input purposes.<br />
              Cannot create a new site.<br /><br />
            </p>
          </Col>
        </Row>
        <UsersTable users={filteredUsers} />
        <Row>
          <UserForm
            currentRole={this.props.roles.get(TECHNICIAN_ROLE)}
            onSubmit={this.onSubmit} />
        </Row>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSiteUsers)
