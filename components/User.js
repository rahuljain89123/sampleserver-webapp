
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import { Button } from '../basecoat/Button'

import { fetchUser, fetchUsers } from '../actions/users'

const UserInfo = props => (
    <div>
        <h3>{props.user.get('username')}</h3>
        <strong>Email: </strong><span>{props.user.get('email')}</span>
    </div>
)

const EditUser = props => (
    <div>
        <h3>Edit User {props.user.get('username')}</h3>
    </div>
)

class User extends React.Component {
    componentDidMount () {
        if (this.props.match.params.id && !this.props.users.get(this.props.match.params.id)) {
            this.props.fetchUser(this.props.match.params.id)
        } else {
            this.props.fetchUsers()
        }
    }

    render () {
        const user = this.props.users.get(parseInt(this.props.match.params.id, 10))

        if (!user) {
            return null
        }

        return (
            <Switch>
                <Route
                    exact
                    path="/app/users/:id(\\d+)"
                    render={() => (
                        <div>
                            <div className="clearfix">
                                <Button
                                    primary
                                    link
                                    href={`/app/users/${this.props.match.params.id}/edit`}
                                    className="float-right"
                                >Edit User</Button>
                            </div>
                            <UserInfo user={user} />
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/app/users/:id(\\d+)/edit"
                    render={() => (
                        <div>
                            <div className="clearfix">
                                <Button
                                    link
                                    href={`/app/users/${this.props.match.params.id}`}
                                    className="float-right"
                                >Back</Button>
                            </div>
                            <EditUser user={user} />
                        </div>
                    )}
                />
            </Switch>
        )
    }
}

const mapStateToProps = store => ({
    users: store.get('users'),
})

const mapDispatchToProps = dispatch => ({
    fetchUser: id => dispatch(fetchUser(id)),
    fetchUsers: () => dispatch(fetchUsers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(User)
