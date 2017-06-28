
import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router-dom'

import ClientApp from './ClientApp'
import LabApp from './LabApp'
import CompanyApp from './CompanyApp'
import TechnicianApp from './TechnicianApp'
import Sidebar from 'components/Sidebar'
import Header from 'components/Header'
import PrivateRoute from 'components/Auth'

import { fetchCurrentUser, signout, reset } from 'actions/users'
import { fetchCurrentLab } from 'actions/labs'
import { fetchRoles } from 'actions/roles'
import { fetchCompanies } from 'actions/companies'
import { flashMessage } from 'actions/global'
import {
  currentUser,
  currentUserRole,
  currentLab,
  safeGet,
  currentCompany,
  loggedIn,
} from 'normalizers'


class App extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.fetchCurrentLab()
    this.props.fetchCurrentUser()
      .catch(() => {
        this.props.flashMessage('danger', 'You must be logged in to view that page.')
        this.props.push('/')
      })
    this.props.fetchCompanies()
    window.analytics.page()
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.roles.size && nextProps.user) {
      this.props.fetchRoles()
      window.analytics.identify(nextProps.user.get('id'), nextProps.user.toJS())
    }

    if (!loggedIn()) {
      this.props.flashMessage('danger', 'You must be logged in to view that page.')
      this.props.push('/')
    }
  }

  componentDidUpdate (prevProps) {
    if(this.props.location.pathname !== prevProps.location.pathname) {
      window.analytics.page()
    }
  }

  render () {
    return (
      <div className="wrapper app">
        <div className="wrapper-inner">
          <Route component={Sidebar} />
          <div className="main-container">
            <Route component={Header} />
            <PrivateRoute path="/app" component={LabApp} authorized={['LabAdmin', 'LabAssociate']} />
            <PrivateRoute path="/app" component={CompanyApp} authorized={['CompanyAdmin', 'CompanyAssociate']} />
            <PrivateRoute path="/app" component={ClientApp} authorized={['ClientManager']} />
            <PrivateRoute path="/app" component={TechnicianApp} authorized={['Technician']} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  roles: store.get('roles'),
  flash: store.get('flash'),
  user: currentUser(store),
  company: currentCompany(store),
  sites: store.get('sites'),
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  fetchCurrentUser: () => dispatch(fetchCurrentUser()),
  fetchCurrentLab: () => dispatch(fetchCurrentLab()),
  fetchCompanies: () => dispatch(fetchCompanies()),
  fetchRoles: () => dispatch(fetchRoles()),
  signout: () => dispatch(signout()),
  reset: () => dispatch(reset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
