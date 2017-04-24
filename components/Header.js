
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

        this.state = {
            dropdownOpen: false,
            flash: {
                class: 'danger',
                message: 'There was an error saving that record!',
                heading: 'Error',
            },
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
        } = this.props

        return (
            <div className="navbar-container">
                {this.state.flash ? (
                    <div className={"flash alert alert alert-" + this.state.flash.class + " fade show"} role="alert">
                        <span className="title">{this.state.flash.heading}</span> {this.state.flash.message}
                    </div>
                ) : ''}
                <Navbar
                    color="faded"
                    light
                    className="flex-row justify-content-end"
                    style={{ marginBottom: 20 }}
                >
                    <Link to="/app" className="mr-auto navbar-brand">{this.getAppTitle()}</Link>
                    { user ? (
                        <Nav className="">
                            {!!user && (
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
                            )}
                        </Nav>
                    ) : (
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink
                                    href="/"
                                    onClick={e => this.onSignin(e)}
                                >Sign In</NavLink>
                            </NavItem>
                        </Nav>
                    )}
                </Navbar>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    roles: store.get('roles'),
    user: currentUser(store),
    labTitle: safeGet(currentLab(store), 'title', 'SampleServe'),
    userEmail: safeGet(currentUser(store), 'email', ''),
    roleDescription: safeGet(currentUserRole(store), 'description', ''),
    company: currentCompany(store),
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
