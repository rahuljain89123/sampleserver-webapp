
import React from 'react'
import { connect } from 'react-redux'
import {
  Navbar,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { Route, Link, NavLink, Switch } from 'react-router-dom'
import PrivateRoute from './Auth'

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

import HeaderButtonLookupTable from './HeaderButtons/HeaderButtonLookupTable'


class Header extends React.Component {
  constructor (props) {
    super(props)
    this.buttonToComponent = this.buttonToComponent.bind(this)
    this.state = {
      dropdownOpen: false,
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

  getAppTitle () {
    if (this.props.company) {
      return this.props.company.get('title')
    }
    return this.props.labTitle
  }

  buttonToComponent (button, index) {
    if (button.get('component')) {

      const Component = HeaderButtonLookupTable[button.get('component')]
      return <Component
        {...button.get('props').toJS()}
        key={index}
        push={this.props.push}
      />
    } else {
      if (button.get('minimumUserRole') &&
          this.props.roleId &&
          this.props.roleId > button.get('minimumUserRole')
      ) {
        return null
      }
      return (
        <button key={index} className="btn btn-default" onClick={() => this.props.push(button.get('onClick'))}>
          {button.get('iconName') ? <i className={`material-icons ${button.get('className')}`}>{button.get('iconName')}</i> : ''}
          {button.get('text')}
        </button>
      )
    }
  }

  render () {
    const {
      user,
      userEmail,
      roleDescription,
      flash,
      headerInfo,
    } = this.props

    let siteTitle = null
    let flashAlert = null
    let userDropdown = null
    let appTitle = null

    if (flash) {
      flashAlert = (
        <div className={`flash alert alert alert-${flash.get('type')} fade show`} role="alert">
          {flash.get('message')}
        </div>
      )
    }

    appTitle = this.getAppTitle()
    const buttons = headerInfo.get('buttons')
    let navbar = null
    let flashOnly = null

    navbar = (
      <div className="navbar-container">
        {flashAlert}
        <Navbar className="d-flex flex-row justify-content-between">
          <div className="navbar-brand">{headerInfo.get('title')}</div>
          <div className="actions">
            {buttons && buttons.map(this.buttonToComponent)}
          </div>
        </Navbar>
      </div>
    )

    flashOnly = (
      <div className="navbar-container">
        {flashAlert}
      </div>
    )

    return (
      <Switch>
        <Route
          path={'/app/sites/:id/reports'}
          component={() => (
            flashOnly
          )}
        />
        <Route
          exact
          path={'/app/sites/:id/setup/site-maps/new'}
          component={() => (
            navbar
          )}
        />
        <Route
          exact
          path={'/app/sites/:id/setup/site-maps/:id'}
          component={() => (
            flashOnly
          )}
        />
        <Route
          path="/"
          component={() => (
            navbar
          )}
        />
      </Switch>
    )
  }
}

const mapStateToProps = store => ({
  roles: store.get('roles'),
  flash: store.get('flash'),
  user: currentUser(store),
  labTitle: safeGet(currentLab(store), 'title', 'SampleServe'),
  userEmail: safeGet(currentUser(store), 'email', ''),
  roleId: safeGet(currentUserRole(store), 'id', null),
  roleDescription: safeGet(currentUserRole(store), 'description', ''),
  company: currentCompany(store),
  sites: store.get('sites'),
  headerInfo: store.get('headerInfo'),
})

const mapDispatchToProps = dispatch => ({
  fetchCurrentUser: () => dispatch(fetchCurrentUser()),
  fetchCurrentLab: () => dispatch(fetchCurrentLab()),
  fetchCompanies: () => dispatch(fetchCompanies()),
  fetchRoles: () => dispatch(fetchRoles()),
  signout: () => dispatch(signout()),
  reset: () => dispatch(reset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
