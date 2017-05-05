
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

import { createUser, fetchUsers } from 'actions/users'
import { currentUserRole } from 'normalizers'


class LabUsers extends React.Component {
  constructor (props) {
    super(props)
    const roles = props.roles

    const activeRole = roles.size ? roles.first().get('id') : 100
    // const currentRole = roles.size ? roles.get(activeRole) : null

    this.state = {
      activeRole,
    }
  }

  componentDidMount () {
    this.props.fetchUsers({ lab_id: this.props.lab.get('id') })
  }

  onToggle (tab) {
    // const currentRole = this.props.roles.size ? this.props.roles.get(tab) : null

    this.setState({
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
    const { activeRole } = this.state
    const currentRole = this.props.roles.size ? this.props.roles.get(activeRole) : null

    const users = this.props.users.filter(user => user.get('role_id') === activeRole).entrySeq()
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
