
import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import {
    Table,
    TabContent,
    TabPane,
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
} from 'reactstrap'

import { createUser, fetchUsers } from '../../actions/users'
import { currentUserRole } from '../../normalizers'


class LabUsers extends React.Component {
    constructor (props) {
        super(props)

        const roles = props.roles
            .filter(role => role.get('id') === 2 || role.get('id') === 3)
            .filter(role => role.get('id') > this.props.currentUserRole.get('id'))
            .sort((a, b) => a.get('id') - b.get('id'))

        const activeRole = roles.size ? roles.first().get('id') : 100
        const currentRole = roles.size ? roles.get(activeRole) : null
        const users = props.users
            .filter(user =>
                user.get('lab_id') === props.lab.get('id') &&
                user.get('role_id') === activeRole)
            .sort((a, b) => a.get('id') - b.get('id'))

        this.state = {
            users,
            roles,
            currentRole,
            activeRole,
            email: '',
        }
    }

    componentDidMount () {
        this.props.fetchUsers({ lab_id: this.props.lab.get('id') })
    }

    componentWillReceiveProps (nextProps) {
        const roles = nextProps.roles
            .filter(role => role.get('id') === 2 || role.get('id') === 3)
            .filter(role => role.get('id') >= this.props.currentUserRole.get('id'))
            .sort((a, b) => a.get('id') - b.get('id'))

        const currentRole = roles.size ? roles.get(this.state.activeRole) : null
        const activeRole = this.props.currentUserRole.get('id')

        const users = nextProps.users
            .filter(user =>
                user.get('lab_id') === this.props.lab.get('id') &&
                user.get('role_id') === activeRole)
            .sort((a, b) => a.get('id') - b.get('id'))

        this.setState({
            users,
            roles,
            currentRole,
            activeRole,
        })
    }

    onToggle (tab) {
        const users = this.props.users
            .filter(user =>
                user.get('lab_id') === this.props.lab.get('id') &&
                user.get('role_id') === tab)
            .sort((a, b) => a.get('id') - b.get('id'))

        const currentRole = this.state.roles.size ? this.state.roles.get(tab) : null

        this.setState({
            users,
            currentRole,
            activeRole: tab,
        })
    }

    onChange (e) {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()

        const user = {
            email: this.state.email,
            lab_id: this.props.lab.get('id'),
            role_id: this.state.activeRole,
        }

        this.props.createUser(user)

        this.setState({
            email: '',
        })
    }

    render () {
        const users = this.state.users.entrySeq()
        const roles = this.state.roles.entrySeq()
        const currentRole = this.state.currentRole

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
                    {!!currentRole && (
                        <Col sm="6">
                            <h6>Add {currentRole.get('description')}</h6>
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
    currentUserRole: currentUserRole(store, 100),
})

const mapDispatchToProps = dispatch => ({
    fetchUsers: filters => dispatch(fetchUsers(filters)),
    createUser: user => dispatch(createUser(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LabUsers)
