
import React from 'react'
import { connect } from 'react-redux'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'

import { fetchCurrentUser, signout } from '../actions/users'
import { fetchCurrentLab } from '../actions/labs'
import { fetchRoles } from '../actions/roles'

class Header extends React.Component {
    componentDidMount () {
        this.props.fetchCurrentLab()
        this.props.fetchCurrentUser()
        this.props.fetchRoles()
    }

    onSignout () {
        this.props.signout()
        this.props.push('/')
    }

    render () {
        return (
            <Navbar
                color="faded"
                light
                className="flex-row"
                style={{ marginBottom: 20 }}
            >
                <NavbarBrand>SampleServe</NavbarBrand>
                <Nav className="ml-auto" navbar>
                    { this.props.currentUser ? (
                        <NavItem>
                            <NavLink
                                href="/signout"
                                onClick={() => this.onSignout()}
                            >Sign Out</NavLink>
                        </NavItem>
                    ) : (
                        <NavItem>
                            <NavLink
                                href="/signin"
                            >Sign In</NavLink>
                        </NavItem>
                    )}
                </Nav>
            </Navbar>
        )
    }
}

const mapStateToProps = store => ({
    roles: store.get('roles'),
    currentLab: store.get('currentLab'),
    currentUser: store.get('currentUser'),
})

const mapDispatchToProps = dispatch => ({
    fetchCurrentUser: () => dispatch(fetchCurrentUser()),
    fetchCurrentLab: () => dispatch(fetchCurrentLab()),
    fetchRoles: () => dispatch(fetchRoles()),
    signout: () => dispatch(signout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
