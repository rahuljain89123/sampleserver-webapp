
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
import SiteNav from 'components/Sites/App/SiteNav'
import { fetchSite } from '../actions/sites'


class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    const siteId = parseInt(props.match.params.id, 10)

    this.state = {
      open: true,
      siteId,
    }
  }

  componentDidMount () {
    if (!this.props.sites.get(this.state.siteId)) {
      this.props.fetchSite(this.state.siteId)
    }
  }

  toggle () {
    this.setState({
      open: !this.state.open,
    })
  }

  sideBarStatus () {
    return (this.state.open ? 'open' : 'closed')
  }

  render () {
    const site = this.props.sites.get(this.state.siteId)
    if (!site) { return null }

    let firstnameSpan = null

    if (this.props.user) {
      firstnameSpan = (<span className="name">{this.props.user.get('firstname')}</span>)
    }

    return (
      <div className="sidebar-container">
        <div className={`sidebar ${this.sideBarStatus()}`}>
          <div className="content">
            <div className="avatar-container">
              <img className="profile-image" src="/static/img/blank-avatar.png" />
                {firstnameSpan}
            </div>
            <i className="fa fa-bars" aria-hidden="true" onClick={e => this.toggle(e)} />
            <SiteNav site={site} />
            <div className="app-logo-container">
              <img className="app-logo" src="/static/img/applogo.png" alt="" />
              &copy; SampleServe
            </div>
          </div>
          <div className="content-closed">
            <div className="avatar-container" />
            <i className="fa fa-bars" aria-hidden="true" onClick={e => this.toggle(e)} />
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
