
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { omit } from '../util'

const PrivateRoute = props => {
    const currentRole = (
        props.currentUser &&
        props.users.size &&
        props.roles.size
    ) ? (
        props.roles.get(
            props.users.get(props.currentUser).get('role_id')
        ).get('name')
    ) : 'Unknown'

    return (
        <Route
            {...omit(props, ['component'])}
            render={routeProps => {
                if (props.authorized && props.authorized.indexOf(currentRole) === -1) {
                    if (currentRole === 'Unknown') {
                        return null
                    }

                    return (
                        <div class="card text-center">
                          <div class="card-block">
                            <h4 class="card-title">Access not allowed</h4>
                            <p class="card-text">Contact your admin if you believe you are seeing this message by mistake.</p>
                          </div>
                        </div>
                    )
                }

                return (
                    props.currentUser ? (
                        React.createElement(props.component, routeProps)
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/signin',
                                state: { from: routeProps.location },
                            }}
                        />
                    )
                )
            }}
        />
    )
}

const mapStateToProps = store => ({
    currentUser: store.get('currentUser'),
    users: store.get('users'),
    roles: store.get('roles'),
})

export default connect(mapStateToProps)(PrivateRoute)
