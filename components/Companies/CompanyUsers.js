
import React from 'react'
import Immutable from 'immutable'
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
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap'


import { fetchCompany } from '../../actions/companies'
import { createUser, fetchUsers } from '../../actions/users'


class CompanyUsers extends React.Component {
    constructor (props) {
        super(props)

        const companyId = parseInt(props.match.params.id, 10)
        const company = props.companies.get(companyId)
        const currentUserRole = (
            props.currentUser &&
            props.users.size
        ) ? (
            props.users.get(props.currentUser).get('role_id')
        ) : 100

        const roles = props.roles
            .filter(role => role.get('id') === 4 || role.get('id') === 5)
            .filter(role => role.get('id') > currentUserRole)
            .sort((a, b) => a.get('id') - b.get('id'))

        const activeRole = roles.size ? roles.first().get('id') : 100
        const currentRole = roles.size ? roles.get(activeRole) : null

        const users = company ? (
            Immutable.List(
                company.get('user_ids')
                       .map(id => props.users.get(id))
            )
        ) : Immutable.List()

        const filteredUsers = users.filter(
            user => (
                user ? (user.get('role_id') === activeRole) : false
            )
        ).sort((a, b) => a.get('id') - b.get('id'))

        this.state = {
            companyId,
            company,
            users: filteredUsers,
            roles,
            currentRole,
            activeRole,
            email: '',
        }
    }

    componentDidMount () {
        this.props.fetchUsers()

        if (!this.state.company) {
            this.props.fetchCompany(this.state.companyId)
        }
    }

    componentWillReceiveProps (nextProps) {
        const company = nextProps.companies.get(this.state.companyId)
        const currentUserRole = (
            nextProps.currentUser &&
            nextProps.users.size
        ) ? (
            nextProps.users.get(nextProps.currentUser).get('role_id')
        ) : 100

        const roles = nextProps.roles
            .filter(role => role.get('id') === 4 || role.get('id') === 5)
            .filter(role => role.get('id') > currentUserRole)
            .sort((a, b) => a.get('id') - b.get('id'))

        const currentRole = roles.size ? roles.get(this.state.activeRole) : null
        const activeRole = (this.state.activeRole === 100 && roles.size) ? roles.first().get('id') : this.state.activeRole

        const users = company ? (
            Immutable.List(
                company.get('user_ids')
                       .map(id => nextProps.users.get(id))
            )
        ) : Immutable.List()

        const filteredUsers = users.filter(
            user => (
                user ? (user.get('role_id') === activeRole) : false
            )
        ).sort((a, b) => a.get('id') - b.get('id'))

        this.setState({
            company: nextProps.companies.get(this.state.companyId),
            users: filteredUsers,
            roles,
            currentRole,
            activeRole,
        })
    }

    onToggle (tab) {
        if (this.state.activeRole !== tab) {
            const users = this.state.company ? (
                Immutable.List(
                    this.state.company.get('user_ids')
                                      .map(id => this.props.users.get(id))
                )
            ) : Immutable.List()

            const filteredUsers = users.filter(
                user => (
                    user ? (user.get('role_id') === tab) : false
                )
            ).sort((a, b) => a.get('id') - b.get('id'))

            const currentRole = this.state.roles.size ? this.state.roles.get(tab) : null

            this.setState({
                users: filteredUsers,
                currentRole,
                activeRole: tab,
            })
        }
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
            role_id: this.state.activeRole,
            companies: {
                add: [this.state.companyId],
                remove: [],
            },
        })

        this.setState({
            email: '',
        })
    }

    render () {
        const company = this.state.company

        if (!company) {
            return null
        }

        const users = this.state.users.entrySeq()
        const roles = this.state.roles.entrySeq()
        const currentRole = this.state.currentRole

        return (
            <div>
                <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
                    <BreadcrumbItem
                        tag="a"
                        href="/app/companies"
                        onClick={e => this.onClick(e)}
                    >
                        Companies
                    </BreadcrumbItem>
                    <BreadcrumbItem
                        tag="a"
                        href={`/app/companies/${company.get('id')}`}
                        onClick={e => this.onClick(e)}
                    >
                        {company.get('title')}
                    </BreadcrumbItem>
                    <BreadcrumbItem className="active">
                        Manage Users
                    </BreadcrumbItem>
                </Breadcrumb>
                <Nav tabs>
                    {roles.map(([id, role]) => (
                        <NavItem key={role.get('id')}>
                            <NavLink
                                className={classnames({ active: this.state.activeRole === role.get('id') })}
                                onClick={() => this.onToggle(role.get('id'))}
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
                                        <Button color="primary">Invite</Button>
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
    currentUser: store.get('currentUser'),
    users: store.get('users'),
    roles: store.get('roles'),
    companies: store.get('companies'),
})

const mapDispatchToProps = dispatch => ({
    fetchCompany: id => dispatch(fetchCompany(id)),
    fetchUsers: () => dispatch(fetchUsers()),
    createUser: user => dispatch(createUser(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyUsers)
