
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import { Button } from '../basecoat/Button'

import EditUserForm from './EditUserForm'
import { fetchLabs } from '../actions/labs'
import { fetchRoles } from '../actions/roles'
import { fetchUser, fetchUsers, editUser } from '../actions/users'

const UserInfo = props => (
    <div>
        <strong>Email: </strong><span>{props.user.get('email')}</span><br />
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
                        <div>
                            <div className="clearfix">
                                <h3 className="float-left">User: {user.get('email')}</h3>
                                <Button
                                    primary
                                    link
                                    href={`/app/users/${this.props.match.params.id}/edit`}
                                    className="float-right"
                                >Edit User</Button>
                                {user.get('active') ? (
                                    <Button
                                        onClick={e => this.deactivate(e)}
                                        className="float-right"
                                        style={{ marginRight: 15 }}
                                    >Deactivate User
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={e => this.activate(e)}
                                        className="float-right"
                                        style={{ marginRight: 15 }}
                                    >Activate User</Button>
                                )}
                            </div>
                            <UserInfo user={user} role={roleTitle} lab={labTitle} />
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/app/users/:id(\\d+)/edit"
                    render={() => (
                        <div>
                            <div className="clearfix">
                                <h3 className="float-left">Edit user: {user.get('email')}</h3>
                                <Button
                                    link
                                    href={`/app/users/${this.props.match.params.id}`}
                                    className="float-right"
                                >Back</Button>
                            </div>
                            <EditUserForm user={user} />
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
