
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

import { fetchProject } from 'actions/projects'
import { createUser, fetchUsers } from 'actions/users'
import { flashMessage } from 'actions/global'

import { msgFromError } from 'helpers/util'

const PROJECT_MANAGER_ROLE = 6


class ProjectUsers extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    this.props.fetchUsers({ projects: this.props.projectId })
    this.props.fetchProject(this.props.projectId)
  }

  onSubmit (userParams) {
    const user = {
      email: userParams.get('email'),
      role_id: PROJECT_MANAGER_ROLE,
      projects: {
        add: [this.props.project.get('id')],
        remove: [],
      },
    }

    this.props.createUser(user)
      .then(() => {
        this.props.flashMessage('success', 'User invited successfully.')
        // Need to fetch project to update project's user_ids
        this.props.fetchProject(this.props.projectId)
      })
      .catch(e => this.props.flashMessage('danger', msgFromError(e)))
  }

  render () {
    const project = this.props.project

    if (!project) {
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
                onSubmit={this.onSubmit} />
            </Row>
        </div>
    )
  }
}

const mapStateToProps = (store, props) => {
  const role = store.get('roles').size ?
    store.get('roles').get(PROJECT_MANAGER_ROLE) : null

  const projectId = parseInt(props.match.params.id, 10)
  const project = store.get('projects').get(projectId)

  const users = store.get('users')
    .filter(user => project.get('user_ids').includes(user.get('id')))
    .filter(user => user.get('role_id') === PROJECT_MANAGER_ROLE)
    .sort((a,b) => a.get('id') - b.get('id'))

  return {
    projectId,
    users,
    role,
    project,
  }
}

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  fetchProject: id => dispatch(fetchProject(id)),
  fetchUsers: filters => dispatch(fetchUsers(filters)),
  createUser: user => dispatch(createUser(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectUsers)
