
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

import { fetchSite } from '../../actions/sites'
import { createUser, fetchUsers } from '../../actions/users'

const TECHNICIAN_ROLE = 7

/* PART OF THE DEFUNCT ADMIN APP. */
class SiteUsers extends React.Component {
  constructor (props) {
    super(props)

    const siteId = parseInt(props.match.params.id, 10)
    const site = props.sites.get(siteId)
    const role = props.roles.size ? props.roles.get(TECHNICIAN_ROLE) : null

    const users = site ? (
      Immutable.List(
        site.get('user_ids')
          .map(id => props.users.get(id)))
    ) : Immutable.List()

    const filteredUsers = users
      .filter(user => (user ? (user.get('role_id') === TECHNICIAN_ROLE) : false))
      .sort((a, b) => a.get('id') - b.get('id'))

    this.state = {
      siteId,
      site,
      users: filteredUsers,
      role,
      email: '',
    }
  }

  componentDidMount () {

    this.props.fetchUsers({ sites: this.state.siteId })

    if (!this.state.site) {
      this.props.fetchSite(this.state.siteId)
    }
  }

  componentWillReceiveProps (nextProps) {
    const site = nextProps.sites.get(this.state.siteId)
    const role = nextProps.roles.size ? nextProps.roles.get(TECHNICIAN_ROLE) : null

    const users = site ? (
      Immutable.List(
        site.get('user_ids')
             .map(id => nextProps.users.get(id)))
    ) : Immutable.List()

    const filteredUsers = users
      .filter(user => (user ? (user.get('role_id') === TECHNICIAN_ROLE) : false))
      .sort((a, b) => a.get('id') - b.get('id'))

    this.setState({
      site: nextProps.sites.get(this.state.siteId),
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
    const user = {
      email: this.state.email,
      lab_id: this.state.labId,
      role_id: TECHNICIAN_ROLE,
      sites: {
        add: [this.state.siteId],
        remove: [],
      },
    }
    this.props.createUser(user).then(() => {
      window.analytics.track('invited user', {
        user: user,
      })
    })
    this.setState({
      email: '',
    })
  }

  render () {
    const site = this.state.site

    if (!site) {
      return null
    }

    const users = this.state.users.entrySeq()
    const role = this.state.role

    return (
      <div>
        <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
          <BreadcrumbItem
            tag="a"
            href="/app/sites"
            onClick={e => this.onClick(e)}
          >
            Sites
          </BreadcrumbItem>
          <BreadcrumbItem
            tag="a"
            href={`/app/sites/${site.get('id')}`}
            onClick={e => this.onClick(e)}
          >
            {site.get('title')}
          </BreadcrumbItem>
          <BreadcrumbItem className="active">
            Manage Users
          </BreadcrumbItem>
        </Breadcrumb>
        <Nav tabs>
          <NavItem>
            <NavLink className="active">
              {role ? `${role.get('description')}s` : ''}
            </NavLink>
          </NavItem>
        </Nav>
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
  sites: store.get('sites'),
})

const mapDispatchToProps = dispatch => ({
  fetchSite: id => dispatch(fetchSite(id)),
  fetchUsers: filters => dispatch(fetchUsers(filters)),
  createUser: user => dispatch(createUser(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteUsers)
