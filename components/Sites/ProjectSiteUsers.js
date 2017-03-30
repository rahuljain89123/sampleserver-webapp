
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

import { createUser, fetchUsers } from '../../actions/users'
import { currentLab, safeGet } from '../../normalizers'

const TECHNICIAN_ROLE = 7


class ProjectSiteUsers extends React.Component {
    constructor (props) {
        super(props)

        const { site, users } = props
        const filteredUsers = Immutable.List(site.get('user_ids')
            .map(id => users.get(id)))
            .filter(user => (user ? (user.get('role_id') === TECHNICIAN_ROLE) : false))
            .sort((a, b) => a.get('id') - b.get('id'))

        this.state = {
            users: filteredUsers,
            email: '',
        }
    }

    componentDidMount () {
        this.props.fetchUsers({ sites: this.state.siteId })
    }

    componentWillReceiveProps (nextProps) {
        const { site, users } = nextProps
        const filteredUsers = Immutable.List(site.get('user_ids')
            .map(id => users.get(id)))
            .filter(user => (user ? (user.get('role_id') === TECHNICIAN_ROLE) : false))
            .sort((a, b) => a.get('id') - b.get('id'))

        this.setState({
            users: filteredUsers,
        })
    }

    onChange (e) {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()

        this.props.createUser({
            email: this.state.email,
            lab_id: this.props.lab.get('id'),
            role_id: TECHNICIAN_ROLE,
            sites: {
                add: [this.props.site.get('id')],
                remove: [],
            },
        })

        this.setState({
            email: '',
        })
    }

    render () {
        const users = this.state.users.entrySeq()

        return (
            <div>
                <h4>{`${this.props.roleDescription}s`}</h4>
                <Row style={{ marginTop: 20 }}>
                    <Col sm="12">
                        <p>
                            Can view/edit sites only for data input purposes.<br />
                            Cannot create a new site.<br /><br />
                        </p>
                    </Col>
                </Row>
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
                    <Col sm="6">
                        <h6>Add {this.props.roleDescription}</h6>
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
                </Row>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    users: store.get('users'),
    roleDescription: safeGet(safeGet(store.get('roles'), TECHNICIAN_ROLE), 'description', ''),
    lab: currentLab(store),
})

const mapDispatchToProps = dispatch => ({
    fetchUsers: filters => dispatch(fetchUsers(filters)),
    createUser: user => dispatch(createUser(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSiteUsers)
