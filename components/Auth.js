
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { currentUserRole, safeGet } from '../normalizers'
import { omit } from 'helpers/util'

const PrivateRoute = props => (
    <Route
        {...omit(props, ['component'])}
        render={routeProps => {
            if (props.authorized && props.authorized.indexOf(props.role) === -1) {
                return null
            }

            return (
                props.currentUser ? (
                    React.createElement(props.component, routeProps)
                ) : (
                    <Redirect
                        to={{
                            pathname: '/',
                            state: { from: routeProps.location },
                        }}
                    />
                )
            )
        }}
    />
)

const mapStateToProps = store => ({
    currentUser: store.get('currentUser'),
    role: safeGet(currentUserRole(store), 'name', 'Unknown'),
})

export default connect(mapStateToProps)(PrivateRoute)
