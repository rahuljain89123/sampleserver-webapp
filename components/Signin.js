
import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import SigninForm from './SigninForm'

const Signin = props => {
    const { from } = props.location.state || { from: { pathname: '/app' } }

    if (props.currentUser) {
        return (
            <Redirect to={from} />
        )
    }

    return (
        <div className="columns">
            <div
                className="one-third column centered border p-3 mb-3"
                style={{ marginTop: 300 }}
            >
                <h2 className="text-center">SampleServe</h2>
                <SigninForm from={from} />
            </div>
        </div>
    )
}

const mapStateToProps = store => ({
    currentUser: store.get('currentUser'),
})

export default connect(mapStateToProps)(Signin)
