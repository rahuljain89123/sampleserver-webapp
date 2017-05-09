
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

import { fetchCurrentUser, signout, reset } from '../actions/users'
import { fetchCurrentLab } from '../actions/labs'
import { fetchRoles } from '../actions/roles'
import { fetchCompanies } from '../actions/companies'
import {
  currentUser,
  currentUserRole,
  currentLab,
  safeGet,
  currentCompany,
} from '../normalizers'

class Header extends React.Component {
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
    const {
      user,
      userEmail,
      roleDescription,
      flash,
    } = this.props

    let siteTitle = null
    let flashAlert = null
    let userDropdown = null

    if (flash) {
      flashAlert = (
        <div className={`flash alert alert alert-${flash.get('type')} fade show`} role="alert">
          {flash.get('message')}
        </div>
      )
    }

    if (user) {
      userDropdown = (
        <Nav className="">
          <Dropdown isOpen={this.state.dropdownOpen} toggle={() => this.toggle()}>
            <DropdownToggle caret className="pointer">
              {`${userEmail}`}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header>{roleDescription}</DropdownItem>
              <DropdownItem onClick={() => this.props.push('/app/team')}>Manage Team</DropdownItem>
              <DropdownItem
                onClick={e => this.onSignout(e)}
                className="pointer"
              >Sign Out</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      )
    } else {
      userDropdown = (
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink
              href="/"
              onClick={e => this.onSignin(e)}
            >Sign In</NavLink>
          </NavItem>
        </Nav>
      )
    }

    if (this.props.sites) {
      console.log(this.props.sites)
      if (this.props.sites.size) {
        siteTitle = this.props.sites.get(this.state.siteId).get('title')
      }
    } else {
      siteTitle = ''
    }

    return (
      <div className="navbar-container">
        {flashAlert}
        <Navbar
          className="flex-row justify-content-end"
          style={{ marginBottom: 20 }}
        >
          <Link to="/app" className="mr-auto navbar-brand navbar-sidebar">{this.getAppTitle()}</Link>
          <div className="site-name">{siteTitle}</div>
          {userDropdown}
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
