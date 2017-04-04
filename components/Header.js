
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
import { fetchCurrentCompany } from '../actions/companies'
import { fetchRoles } from '../actions/roles'
import {
    currentUser,
    currentUserRole,
    currentLab,
    safeGet,
} from '../normalizers'

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
        this.props.fetchCurrentCompany()
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

    render () {
        const {
            user,
            labTitle,
            userEmail,
            roleDescription,
        } = this.props

        return (
            <Navbar
                color="faded"
                light
                className="flex-row justify-content-end"
                style={{ marginBottom: 20 }}
            >
                <Link to="/app" className="mr-auto navbar-brand">{labTitle} {this.props.currentCompany ? "exists" : ''}</Link>
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
        )
    }
}

const mapStateToProps = store => ({
    roles: store.get('roles'),
    user: currentUser(store),
    currentCompany: safeGet(store.get('currentCompany'), ''),
    labTitle: safeGet(currentLab(store), 'title', 'SampleServe'),
    userEmail: safeGet(currentUser(store), 'email', ''),
    roleDescription: safeGet(currentUserRole(store), 'description', ''),
})

const mapDispatchToProps = dispatch => ({
    fetchCurrentUser: () => dispatch(fetchCurrentUser()),
    fetchCurrentLab: () => dispatch(fetchCurrentLab()),
    fetchCurrentCompany: () => dispatch(fetchCurrentCompany()),
    fetchRoles: () => dispatch(fetchRoles()),
    signout: () => dispatch(signout()),
    reset: () => dispatch(reset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
