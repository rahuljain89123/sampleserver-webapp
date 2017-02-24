
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { omit } from '../util'

const PrivateRoute = props => (
    <Route
        {...omit(props, ['component'])}
        render={routeProps => (
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
        )}
    />
)

const mapStateToProps = store => ({
    currentUser: store.get('currentUser'),
})

export default connect(mapStateToProps)(PrivateRoute)
