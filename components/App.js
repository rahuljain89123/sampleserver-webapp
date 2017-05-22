
import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router-dom'

import PrivateRoute from './Auth'
import ProjectApp from './ProjectApp'
import LabApp from './LabApp'
import CompanyApp from './CompanyApp'
import AdminApp from './AdminApp'
import Sidebar from 'components/Sidebar'
import Header from 'components/Header'

import { fetchCurrentUser, signout, reset } from 'actions/users'
import { fetchCurrentLab } from 'actions/labs'
import { fetchRoles } from 'actions/roles'
import { fetchCompanies } from 'actions/companies'
import {
  currentUser,
  currentUserRole,
  currentLab,
  safeGet,
  currentCompany,
} from 'normalizers'


class App extends React.Component {
    constructor (props) {
      super(props)
    }

    componentDidMount () {
      this.props.fetchCurrentLab()
      this.props.fetchCurrentUser()
      this.props.fetchCompanies()
    }

    componentWillReceiveProps (nextProps) {
      if (!nextProps.roles.size && nextProps.user) {
        this.props.fetchRoles()
      }
    }

    getAppTitle () {
      if (this.props.company) {
        return this.props.company.get('title')
      }
      return this.props.labTitle
    }

    render () {
        return (
            <div className="wrapper app">
                <div className="wrapper-inner">
                    <Route component={Sidebar} />
                    <div className="main-container">
                        <Route component={Header} appTitle={this.getAppTitle()} />
                        <div className="container-fluid">
                            <PrivateRoute path="/app" component={LabApp} authorized={['LabAdmin', 'LabAssociate']} />
                            <PrivateRoute path="/app" component={CompanyApp} authorized={['CompanyAdmin', 'CompanyAssociate']} />
                            <PrivateRoute path="/app" component={ProjectApp} authorized={['ProjectManager']} />
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(App)
