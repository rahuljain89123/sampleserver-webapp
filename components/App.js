
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

      const siteId = parseInt(props.match.params.id, 10)

      this.state = {
        dropdownOpen: false,
        siteId,
      }
    }

    toggle () {
      this.setState({
        dropdownOpen: !this.state.dropdownOpen,
      })
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

    onSignin (e) {
      e.preventDefault()
      this.props.push('/')
    }

    onSignout (e) {
      e.preventDefault()
      this.props.signout()
        .then(() => {
          this.props.reset()
          this.props.fetchCurrentLab()
          this.props.push('/')
        })
    }

    getAppTitle () {
      if (this.props.company) {
        return this.props.company.get('title')
      }
      return this.props.labTitle
    }

    render () {
        if (this.props.sites && this.state.siteId) {
            const site = this.props.sites.get(this.state.siteId)
        }

        return (
            <div className="wrapper app">
                <div className="wrapper-inner">
                    <Route component={Sidebar} />
                    <div className="main-container">
                        <Switch>
                            <PrivateRoute
                                component={Header}
                                path={`/app/sites/:id`}
                                authorized={['LabAdmin', 'LabAssociate']}
                            />
                            <PrivateRoute
                                component={Header}
                                path={`/app/sites/:id`}
                                authorized={['CompanyAdmin', 'CompanyAssociate']}
                            />
                            <PrivateRoute
                                component={Header}
                                authorized={['CompanyAdmin', 'CompanyAssociate']}
                            />
                            <PrivateRoute
                                component={Header}
                                path={`/app/sites/:id`}
                                authorized={['ProjectManager']}
                            />
                            <PrivateRoute
                                component={Header}
                                authorized={['ProjectManager']}
                            />
                        </Switch>
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
