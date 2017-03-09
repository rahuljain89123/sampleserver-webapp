
import React from 'react'
import { connect } from 'react-redux'

import SigninForm from './SigninForm'

const Signin = props => {
    const { from } = props.location.state || { from: { pathname: '/app' } }
    const lab = props.labs.filter(lab => lab.get('url') === props.currentLabUrl).first()

    return (
        <div className="row justify-content-center" style={{ marginTop: 200 }}>
            <div className="col-4">
                <h2 className="text-center">{lab ? lab.get('title') : '\u00a0'}</h2>
                <SigninForm push={props.push} from={from} />
            </div>
        </div>
    )
}

const mapStateToProps = store => ({
    labs: store.get('labs'),
    currentLabUrl: store.get('currentLabUrl'),
})

export default connect(mapStateToProps)(Signin)
