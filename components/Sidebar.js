
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
} from '../normalizers'
import SiteNav from 'components/Sites/App/SiteNav'
import { fetchSite } from 'actions/sites'


class Sidebar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      open: true,
      dropdownOpen: false,
    }
  }


  toggleSidebar () {
    this.setState({
      open: !this.state.open,
    })
  }

  toggle () {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    })
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

  sideBarStatus () {
    return (this.state.open ? 'open' : 'closed')
  }

  render () {
    const roleDescription = this.props.roleDescription

    let nameSpan = null
    let profileImgSrc = null
    let myNav = null
    let showManageTeam = true

    if (this.props.user) {
      showManageTeam = !this.props.user.get('role_id') === 6 && !this.props.user.get('role_id') === 7

      nameSpan = (<span className="name">{this.props.user.get('name')}</span>)
      profileImgSrc = this.props.user.get('photo_url') ? this.props.user.get('photo_url') : '/static/img/blank-avatar.png'
    } else {
      profileImgSrc = '/static/img/blank-avatar.png'
    }

    return (
      <div className="sidebar-container">
        <div className={`sidebar ${this.sideBarStatus()}`}>
          <div className="content">
            <Nav className="avatar-dropdown">
              <Dropdown isOpen={this.state.dropdownOpen} toggle={() => this.toggle()} className="light">
                <DropdownToggle className="pointer avatar-container">
                  <img className="profile-image" src={profileImgSrc} alt="avatar" />
                  {nameSpan}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem header>{roleDescription}</DropdownItem>
                  <DropdownItem onClick={() => this.props.push('/complete-profile')}>Edit Profile </DropdownItem>

                  <DropdownItem
                    onClick={e => this.onSignout(e)}
                    className="pointer"
                  >Sign Out</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Nav>
            <i className="material-icons" onClick={e => this.toggleSidebar(e)}>menu</i>

            <Switch>
              <Route
                exact
                path="/app/sites/new"
                component={() => (
                  <nav className="nav nav-pills flex-column">
                    <NavLink
                      exact
                      to={`/app/`}
                      className="nav-link nav-parent"
                      activeClassName="active"
                    >Dashboard</NavLink>
                    { showManageTeam && <NavLink
                        exact
                        to={`/app/team`}
                        className="nav-link nav-parent"
                        activeClassName="active"
                      >Manage Team</NavLink>
                    }
                  </nav>
                )}
              />
              <Route
                path="/app/sites/:id"
                component={SiteNav}
              />
              <Route
                path="/app"
                component={() => (
                  <nav className="nav nav-pills flex-column">
                    <NavLink
                      exact
                      to={`/app/`}
                      className="nav-link nav-parent"
                      activeClassName="active"
                    >Dashboard</NavLink>
                    { showManageTeam && <NavLink
                        exact
                        to={`/app/team`}
                        className="nav-link nav-parent"
                        activeClassName="active"
                      >Manage Team</NavLink>
                    }
                  </nav>
                )}
              />
            </Switch>

            <div className="app-logo-container">
              <img className="app-logo" src="/static/img/applogo.png" alt="" />
              &copy; SampleServe
            </div>
          </div>
          <div className="content-closed">
            <div className="avatar-container" />
            <i className="material-icons" onClick={e => this.toggleSidebar(e)}>menu</i>
            <div className="app-logo-container">
              <img className="app-logo" src="/static/img/applogo.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  sites: store.get('sites'),
  user: currentUser(store),
  labTitle: safeGet(currentLab(store), 'title', 'SampleServe'),
  userEmail: safeGet(currentUser(store), 'email', ''),
  roles: store.get('roles'),
  roleDescription: safeGet(currentUserRole(store), 'description', ''),
  company: currentCompany(store),
})

const mapDispatchToProps = dispatch => ({
  fetchSite: id => dispatch(fetchSite(id)),
  fetchCurrentLab: () => dispatch(fetchCurrentLab()),
  signout: () => dispatch(signout()),
  reset: () => dispatch(reset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
