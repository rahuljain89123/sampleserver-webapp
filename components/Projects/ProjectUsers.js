
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

import { fetchProject } from '../../actions/projects'
import { createUser, fetchUsers } from '../../actions/users'

const PROJECT_MANAGER_ROLE = 6


class ProjectUsers extends React.Component {
    constructor (props) {
        super(props)

        const projectId = parseInt(props.match.params.id, 10)
        const project = props.projects.get(projectId)
        const role = props.roles.size ? props.roles.get(PROJECT_MANAGER_ROLE) : null

        const users = project ? (
            Immutable.List(
                project.get('user_ids')
                       .map(id => props.users.get(id)))
        ) : Immutable.List()

        const filteredUsers = users
            .filter(user => (user ? (user.get('role_id') === PROJECT_MANAGER_ROLE) : false))
            .sort((a, b) => a.get('id') - b.get('id'))

        this.state = {
            projectId,
            project,
            users: filteredUsers,
            role,
            email: '',
        }
    }

    componentDidMount () {
        this.props.fetchUsers({ projects: this.state.projectId })

        if (!this.state.project) {
            this.props.fetchProject(this.state.projectId)
        }
    }

    componentWillReceiveProps (nextProps) {
        const project = nextProps.projects.get(this.state.projectId)
        const role = nextProps.roles.size ? nextProps.roles.get(PROJECT_MANAGER_ROLE) : null

        const users = project ? (
            Immutable.List(
                project.get('user_ids')
                       .map(id => nextProps.users.get(id)))
        ) : Immutable.List()

        const filteredUsers = users
            .filter(user => (user ? (user.get('role_id') === PROJECT_MANAGER_ROLE) : false))
            .sort((a, b) => a.get('id') - b.get('id'))

        this.setState({
            project: nextProps.projects.get(this.state.projectId),
            users: filteredUsers,
            role,
        })
    }

    onChange (e) {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onClick (e) {
        e.preventDefault()
        this.props.push(e.target.getAttribute('href'))
    }

    onSubmit (e) {
        e.preventDefault()

        this.props.createUser({
            email: this.state.email,
            lab_id: this.state.labId,
            role_id: PROJECT_MANAGER_ROLE,
            projects: {
                add: [this.state.projectId],
                remove: [],
            },
        })

        this.setState({
            email: '',
        })
    }

    render () {
        const project = this.state.project

        if (!project) {
            return null
        }

        const users = this.state.users.entrySeq()
        const role = this.state.role

        return (
            <div>
                {!!users.size && (
                    <Table size="sm" style={{ marginBottom: 60 }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(([id, user]) => (
                                <tr key={id}>
                                    <td>{user.get('name') || '-'}</td>
                                    <td>{user.get('email')}</td>
                                    <td>{user.get('active') ? (
                                        <Badge color="success">Active</Badge>
                                    ) : (
                                        <Badge>Pending</Badge>
                                    )}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                <Row>
                    {!!role && (
                        <Col sm="6">
                            <h6>Add {role.get('description')}</h6>
                            <Form onSubmit={e => this.onSubmit(e)}>
                                <FormGroup>
                                    <InputGroup>
                                        <Input
                                            name="email"
                                            placeholder="name@example.com"
                                            value={this.state.email}
                                            onChange={e => this.onChange(e)}
                                        />
                                        <InputGroupButton>
                                            <Button color="primary" className="pointer">
                                                Invite
                                            </Button>
                                        </InputGroupButton>
                                    </InputGroup>
                                </FormGroup>
                            </Form>
                        </Col>
                    )}
                </Row>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    users: store.get('users'),
    roles: store.get('roles'),
    projects: store.get('projects'),
})

const mapDispatchToProps = dispatch => ({
    fetchProject: id => dispatch(fetchProject(id)),
    fetchUsers: filters => dispatch(fetchUsers(filters)),
    createUser: user => dispatch(createUser(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectUsers)
