
import React from 'react'
import { connect } from 'react-redux'
import qs from 'qs'

import ForgotForm from './ForgotForm'
import ResetForm from './ResetForm'
import { currentLab, safeGet } from '../../normalizers'

const NBSPACE = '\u00a0'

class Forgot extends React.Component {
  render () {
    const query = qs.parse(this.props.location.search.substr(1))

    return (
      <div className="row justify-content-center">
        <div className="col-4">
          <div className="standalone-form">
            <h2 className="text-center">{this.props.labTitle}</h2>
            {query.code ? (
              <ResetForm push={this.props.push} code={query.code} />
            ) : (
              <ForgotForm push={this.props.push} />
            )}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  labTitle: safeGet(currentLab(store), 'title', NBSPACE),
})

export default connect(mapStateToProps)(Forgot)
