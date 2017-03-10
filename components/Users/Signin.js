
import React from 'react'
import { connect } from 'react-redux'

import SigninForm from './SigninForm'

const NBSPACE = '\u00a0'

class Signin extends React.Component {
    componentWillMount () {
        const { from } = this.props.location.state || { from: { pathname: '/app' } }

        if (this.props.currentUser) {
            this.props.push(from.pathname)
        }
    }

    render () {
        const { from } = this.props.location.state || { from: { pathname: '/app' } }
        const lab = this.props.labs.filter(fLab => fLab.get('url') === this.props.currentLabUrl).first()

        return (
            <div className="row justify-content-center" style={{ marginTop: 200 }}>
                <div className="col-4">
                    <h2 className="text-center">{lab ? lab.get('title') : NBSPACE}</h2>
                    <SigninForm push={this.props.push} from={from} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    labs: store.get('labs'),
    currentLabUrl: store.get('currentLabUrl'),
    currentUser: store.get('currentUser'),
})

export default connect(mapStateToProps)(Signin)