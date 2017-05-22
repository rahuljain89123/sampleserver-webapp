
import React from 'react'
import { connect } from 'react-redux'
import { Route, Link, NavLink, Switch } from 'react-router-dom'
import PrivateRoute from './Auth'


class TitleApp extends React.Component {
  constructor (props) {
    super(props)
    console.log(this.props.title)
    this.state = {
    }
  }

  render () {
    return (
      <div className="navbar-brand">
        <Route
          path="/app"
          component={() => (
            <span>Test</span>
          )}
          authorized={['LabAdmin', 'LabAssociate']}
        />
        <Route
          path="/app"
          component={() => (
            <span>Test</span>
          )}
          authorized={['CompanyAdmin', 'CompanyAssociate']}
        />
        <Route
          path="/app"
          component={() => (
            <span>Test</span>
          )}
          authorized={['ProjectManager']}
        />
      </div>
    )
  }
}

const mapStateToProps = store => ({
  roles: store.get('roles'),
  flash: store.get('flash'),
  user: currentUser(store),
  labTitle: safeGet(currentLab(store), 'title', 'SampleServe'),
  userEmail: safeGet(currentUser(store), 'email', ''),
  roleDescription: safeGet(currentUserRole(store), 'description', ''),
  company: currentCompany(store),
  sites: store.get('sites'),
})

const mapDispatchToProps = dispatch => ({
  fetchCurrentUser: () => dispatch(fetchCurrentUser()),
  fetchCurrentLab: () => dispatch(fetchCurrentLab()),
  fetchCompanies: () => dispatch(fetchCompanies()),
  fetchRoles: () => dispatch(fetchRoles()),
  signout: () => dispatch(signout()),
  reset: () => dispatch(reset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TitleApp)
