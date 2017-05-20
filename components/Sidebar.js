
import React from 'react'
import { connect } from 'react-redux'
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { Link } from 'react-router-dom'

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
import { fetchSite } from '../actions/sites'


class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    const siteId = parseInt(props.match.params.id, 10)

    this.state = {
      open: true,
      siteId,
      dropdownOpen: false,
    }
  }

  componentDidMount () {
    if (!this.props.sites.get(this.state.siteId)) {
      this.props.fetchSite(this.state.siteId)
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
    const site = this.props.sites.get(this.state.siteId)
    const roleDescription = this.props.roleDescription
    if (!site) { return null }

    let nameSpan = null
    let profileImgSrc = null

    if (this.props.user) {
      nameSpan = (<span className="name">{this.props.user.get('name')}</span>)
      profileImgSrc = this.props.user.get('photo_url')
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
                  <DropdownItem onClick={() => this.props.push('/app/team')}>Manage Team</DropdownItem>
                  <DropdownItem onClick={() => this.props.push('/complete-profile')}>Edit Profile </DropdownItem>

                  <DropdownItem
                    onClick={e => this.onSignout(e)}
                    className="pointer"
                  >Sign Out</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Nav>
            <i className="material-icons" onClick={e => this.toggleSidebar(e)}>menu</i>
            <SiteNav site={site} />
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
