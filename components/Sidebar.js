
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
        console.log(siteId)

        this.state = {
            open: false,
            siteId,
        }
    }

    toggle () {
        this.setState({
            open: !this.state.open,
        })
    }

    componentDidMount () {
      if (!this.props.sites.get(this.state.siteId)) {
        this.props.fetchSite(this.state.siteId)
      }
    }

    componentWillReceiveProps () {
    }

    render () {
        const site = this.props.sites.get(this.state.siteId)
        if (!site) { return null }

        return (
            <div className="sidebar-container">
                <div className="sidebar">
                    <div className="content">
                        <h1>Sidebar</h1>
                        <SiteNav site={site} />
                    </div>
                    <div className="content-closed">
                        <span>its closed</span>
                        <img className="app-logo" src="/static/img/applogo.png" alt=""/>
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
