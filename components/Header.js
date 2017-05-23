
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


class Header extends React.Component {
  constructor (props) {
    super(props)

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

  render () {
    const {
      user,
      userEmail,
      roleDescription,
      flash,
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
    const buttons = this.props.headerInfo.get('buttons')

    return (
      <div className="navbar-container">
        {flashAlert}
        <Navbar className="d-flex flex-row justify-content-between">
          <div className="navbar-brand">{this.props.headerInfo.get('title')}</div>

          {buttons && buttons.map(button => (
            <button className="btn btn-default" onClick={button.onClick}>
              {button.text}
            </button>
          ))}

        </Navbar>
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
