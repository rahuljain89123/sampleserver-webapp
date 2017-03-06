
import React from 'react'

import SigninForm from './SigninForm'

const Signin = props => {
    const { from } = props.location.state || { from: { pathname: '/app' } }

    return (
        <div className="row justify-content-center" style={{ marginTop: 200 }}>
            <div className="col-4">
                <h2 className="text-center">SampleServe</h2>
                <SigninForm push={props.push} from={from} />
            </div>
        </div>
    )
}

export default Signin
