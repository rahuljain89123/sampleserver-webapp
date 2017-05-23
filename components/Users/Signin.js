
import React from 'react'
import { connect } from 'react-redux'

import SigninForm from './SigninForm'
import { currentLab, safeGet } from 'normalizers'

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

    return (
      <div className="row justify-content-center">
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-8">
          <div className="standalone-form">
            <h2 className="text-center">{this.props.labTitle}</h2>
            <SigninForm push={this.props.push} from={from} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  labTitle: safeGet(currentLab(store), 'title', NBSPACE),
  currentUser: store.get('currentUser'),
})

export default connect(mapStateToProps)(Signin)
