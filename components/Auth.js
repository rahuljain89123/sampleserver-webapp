
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { Blankslate } from '../basecoat/Blankslate'

import { omit } from '../util'

const PrivateRoute = props => {
    const currentRole = (
        props.currentUser &&
        props.users.size &&
        props.roles.size
    ) ? props.roles.get(props.users.get(props.currentUser).get('role_id')) : null

    return (
        <Route
            {...omit(props, ['component'])}
            render={routeProps => {
                if (props.authorized && props.authorized.indexOf(currentRole) === -1) {
                    return (
                        <Blankslate>
                            <h3>Access not allowed</h3>
                            <p>Contact your admin if you believe you are seeing this message by mistake.</p>
                        </Blankslate>
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
