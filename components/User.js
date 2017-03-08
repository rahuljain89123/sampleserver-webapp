
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { Row, Col, Button } from 'reactstrap'

import LinkButton from './LinkButton'
import EditUserForm from './EditUserForm'
import { fetchLabs } from '../actions/labs'
import { fetchRoles } from '../actions/roles'
import { fetchUser, fetchUsers, editUser } from '../actions/users'

const UserInfo = props => (
    <div>
        <strong>Full name: </strong><span>{props.user.get('name') || '-'}</span><br />
        <strong>Email: </strong><span>{props.user.get('email')}</span><br />
        <strong>Phone number: </strong><span>{props.user.get('phone') || '-'}</span><br />
        <strong>Lab: </strong><span>{props.lab || '-'}</span><br />
        <strong>Role: </strong><span>{props.role || '-'}</span><br />
        <strong>Active: </strong><span>{props.user.get('active') ? 'Yes' : 'No'}</span><br />
    </div>
)

class User extends React.Component {
    constructor (props) {
        super(props)

        const userId = parseInt(props.match.params.id, 10)
        const user = props.users.get(userId)

        this.state = {
            userId,
            user,
        }
    }

    componentDidMount () {
        if (!this.state.user) {
            this.props.fetchUser(this.state.userId)
        }

        this.props.fetchRoles()
        this.props.fetchLabs()
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            user: nextProps.users.get(this.state.userId),
        })
    }

    deactivate () {
        this.props.editUser(this.state.userId, {
            active: false,
        })
    }

    activate () {
        this.props.editUser(this.state.userId, {
            active: true,
        })
    }

    render () {
        const user = this.state.user

        if (!user) {
            return null
        }

        const lab = this.props.labs.get(user.get('lab_id'))
        const labTitle = lab ? lab.get('title') : '-'

        const role = this.props.roles.get(user.get('role_id'))
        const roleTitle = role ? role.get('name') : '-'

        return (
            <Switch>
                <Route
                    exact
                    path="/app/users/:id(\\d+)"
                    render={() => (
                        <div className="card">
                          <div className="card-block">
                            <div className="card-title d-flex flex-row">
                                <h4>User: {user.get('email')}</h4>
                                <span className="ml-auto">
                                    {user.get('active') ? (
                                        <Button onClick={e => this.deactivate(e)}>
                                            Deactivate User
                                        </Button>
                                    ) : (
                                        <Button onClick={e => this.activate(e)}>
                                            Activate User
                                        </Button>
                                    )}
                                    <LinkButton
                                        color="primary"
                                        href={`/app/users/${this.props.match.params.id}/edit`}
                                        style={{ marginLeft: 10 }}
                                    >Edit User</LinkButton>
                                </span>
                            </div>
                            <UserInfo user={user} role={roleTitle} lab={labTitle} />
                          </div>
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/app/users/:id(\\d+)/edit"
                    render={() => (
                        <div className="card">
                          <div className="card-block">
                            <div className="card-title d-flex flex-row">
                                <h4>Edit user: {user.get('email')}</h4>
                                <LinkButton
                                    href={`/app/users/${this.props.match.params.id}`}
                                    className="ml-auto"
                                >Back</LinkButton>
                            </div>
                            <Row>
                                <Col sm={6}>
                                    <EditUserForm user={user} push={this.props.push} />
                                </Col>
                            </Row>
                          </div>
                        </div>
                    )}
                />
            </Switch>
        )
    }
}

const mapStateToProps = store => ({
    users: store.get('users'),
    roles: store.get('roles'),
    labs: store.get('labs'),
})

const mapDispatchToProps = dispatch => ({
    fetchUser: id => dispatch(fetchUser(id)),
    fetchUsers: () => dispatch(fetchUsers()),
    fetchRoles: () => dispatch(fetchRoles()),
    fetchLabs: () => dispatch(fetchLabs()),
    editUser: (id, user) => dispatch(editUser(id, user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(User)
