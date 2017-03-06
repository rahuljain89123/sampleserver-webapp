
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
    Input,
    InputGroup,
    InputGroupButton,
} from 'reactstrap'


import { createUser, fetchUsers } from '../actions/users'


class LabUsers extends React.Component {
    constructor (props) {
        super(props)

        const labId = parseInt(props.match.params.id, 10)
        const currentUserRole = (
            props.currentUser &&
            props.users.size
        ) ? (
            props.users.get(props.currentUser).get('role_id')
        ) : 100

        const roles = props.roles
            .filter(role => role.get('id') > currentUserRole)
            .sort((a, b) => a.get('id') - b.get('id'))

        const activeRole = roles.size ? roles.first().get('id') : 100
        const currentRole = roles.size ? roles.get(activeRole) : null
        const users = props.users.filter(
            user =>
                user.get('lab_id') === labId &&
                user.get('role_id') === activeRole
        ).sort((a, b) => a.get('id') - b.get('id'))

        this.state = {
            labId,
            users,
            roles,
            currentRole,
            activeRole,
            email: '',
        }
    }

    componentDidMount () {
        this.props.fetchUsers()
    }

    componentWillReceiveProps (nextProps) {
        const currentUserRole = (
            nextProps.currentUser &&
            nextProps.users.size
        ) ? (
            nextProps.users.get(nextProps.currentUser).get('role_id')
        ) : 100

        const roles = nextProps.roles
            .filter(role => role.get('id') > currentUserRole)
            .sort((a, b) => a.get('id') - b.get('id'))

        const currentRole = roles.size ? roles.get(this.state.activeRole) : null
        const activeRole = (this.state.activeRole === 100 && roles.size) ? roles.first().get('id') : this.state.activeRole

        const users = nextProps.users.filter(
            user =>
                user.get('lab_id') === this.state.labId &&
                user.get('role_id') === activeRole
        ).sort((a, b) => a.get('id') - b.get('id'))

        this.setState({
            users,
            roles,
            currentRole,
            activeRole,
        })
    }

    onToggle (tab) {
        if (this.state.activeRole !== tab) {
            const users = this.props.users.filter(
                user =>
                    user.get('lab_id') === this.state.labId &&
                    user.get('role_id') === tab
            ).sort((a, b) => a.get('id') - b.get('id'))
            const currentRole = this.state.roles.size ? this.state.roles.get(tab) : null

            this.setState({
                users,
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

    onSubmit (e) {
        e.preventDefault()

        this.props.createUser({
            email: this.state.email,
            lab_id: this.state.labId,
            role_id: this.state.activeRole,
        })

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
                          className={classnames({ active: this.state.activeRole === role.get('id') })}
                          onClick={() => this.onToggle(role.get('id'))}
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
                  <TabPane tabId={4}>
                    <Row>
                      <Col sm="12">
                        <p>
                            Can create additional CompanyAdmin Users.<br />
                            CompanyAdmin users can disable other CompanyAdmin users.<br />
                            CompanyAdmin cannot disable himself.<br />
                            All CompanyAdmins receive notification the invoice, and all have the ability to pay.<br />
                            Also have CompanyAssociate permissions.<br /><br />
                        </p>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId={5}>
                    <Row>
                      <Col sm="12">
                        <p>
                            Can create/edit/view all sites within the company.<br />
                            Can create site groups.<br />
                            Can add project managers and technicians to each site group.<br /><br />
                        </p>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId={6}>
                    <Row>
                      <Col sm="12">
                        <p>
                            Is assigned by CompanyAdmin or CompanyAssociate only.<br />
                            Can create/edit/view sites within assigned group of sites but cannot delete.<br />
                            Can assign Technicians on a site-by-site basis only.<br /><br />
                        </p>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId={7}>
                    <Row>
                      <Col sm="12">
                        <p>
                            Can view/edit sites only for data input purposes<br />
                            Cannot create a new site<br /><br />
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
                            <td scope="row"></td>
                            <td>{user.get('email')}</td>
                            <td>{user.get('active')}</td>
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
})

const mapDispatchToProps = dispatch => ({
    fetchUsers: () => dispatch(fetchUsers()),
    createUser: user => dispatch(createUser(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LabUsers)
