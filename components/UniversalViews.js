
import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

import Signin from 'components/Users/Signin'
import Forgot from 'components/Users/Forgot'
import AcceptInvite from 'components/Users/AcceptInvite'
import CompleteProfile from 'components/Users/CompleteProfile'
import CompleteSite from 'Sites/SiteInfo/CompleteSite'
import PrivateRoute from 'components/Auth'

import { currentLab, safeGet } from 'normalizers'
import { fetchCurrentUser, signout, reset } from 'actions/users'
import { fetchCurrentLab } from 'actions/labs'
import { fetchRoles } from 'actions/roles'
import { fetchCompanies } from 'actions/companies'

const NBSPACE = '\u00a0'

class UniversalViews extends React.Component {
  componentDidMount () {
    this.props.fetchCurrentLab()
    this.props.fetchCurrentUser()
    this.props.fetchCompanies()
  }

  render () {
    const { flash } = this.props
    let flashAlert = null
    if (flash) {
      flashAlert = (
        <div className={`flash alert alert alert-${flash.get('type')} fade show`} role="alert">
          {flash.get('message')}
        </div>
      )
    }

    return (
      <div className="container-fluid">
        {flashAlert}
        <Route exact path="/" component={Signin} />
        <Route exact path="/forgot" component={Forgot} />
        <Route exact path="/accept-invite" component={props => <AcceptInvite lab={this.props.lab} {...props} />} />
        <PrivateRoute exact path="/complete-site/:id" component={CompleteSite} />
        <PrivateRoute exact path="/complete-profile" component={CompleteProfile} />
      </div>
    )
  }
}

const mapStateToProps = store => ({
  flash: store.get('flash'),
  lab: currentLab(store),
})

const mapDispatchToProps = dispatch => ({
  fetchCurrentUser: () => dispatch(fetchCurrentUser()),
  fetchCurrentLab: () => dispatch(fetchCurrentLab()),
  fetchCompanies: () => dispatch(fetchCompanies()),
  fetchRoles: () => dispatch(fetchRoles()),
  signout: () => dispatch(signout()),
  reset: () => dispatch(reset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UniversalViews)
