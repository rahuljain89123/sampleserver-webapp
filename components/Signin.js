
import React from 'react'
import { connect } from 'react-redux'
import { fetchCurrentLab } from '../actions/labs'

import SigninForm from './SigninForm'

class Signin extends React.Component {
    constructor (props) {
        super(props)

        this.props.fetchCurrentLab();
        console.log(this.props);
    }

    componentDidMount () {
        this.props.fetchCurrentLab();
        console.log(this.props);
    }

    render () {
        const { from } = this.props.location.state || { from: { pathname: '/app' } }

        return (
            <div className="row justify-content-center" style={{ marginTop: 200 }}>
                <div className="col-4">
                    <p>{this.props.currentLabUrl}</p>
                    <SigninForm push={this.props.push} from={from} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    currentLab: store.get('currentLab'),
})

const mapDispatchToProps = dispatch => ({
    fetchCurrentLab: () => dispatch(fetchCurrentLab()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Signin)
