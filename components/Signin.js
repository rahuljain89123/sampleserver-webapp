
import React from 'react'

import SigninForm from './SigninForm'

const Signin = props => {
    const { from } = props.location.state || { from: { pathname: '/app' } }

    return (
        <div className="columns">
            <div
                className="one-third column centered border p-3 mb-3"
                style={{ marginTop: 200 }}
            >
                <h2 className="text-center">SampleServe</h2>
                <SigninForm push={props.push} from={from} />
            </div>
        </div>
    )
}

export default Signin
