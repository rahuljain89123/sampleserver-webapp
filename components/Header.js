
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
    }

    componentWillReceiveProps (nextProps) {
        if (!this.props.roles.size && nextProps.currentUser) {
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
        this.props.push('/')
    }

    render () {
        const user = (
            this.props.currentUser &&
            this.props.users.size
        ) ? (
            this.props.users.get(this.props.currentUser)
        ) : null

        const role = (
            user &&
            this.props.roles.size
        ) ? (
            this.props.roles.get(user.get('role_id'))
        ) : null

        return (
            <Navbar
                color="faded"
                light
                className="flex-row"
                style={{ marginBottom: 20 }}
            >
                <NavbarBrand>SampleServe</NavbarBrand>
                { this.props.currentUser ? (
                    <Nav className="ml-auto flex-row" navbar>
                        {!!user && !!role && (
                            <NavItem>
                                <NavLink style={{ marginRight: 15 }}>
                                    {`${user.get('email')} (${role.get('description')})`}
                                </NavLink>
                            </NavItem>
                        )}
                        <NavItem>
                            <NavLink
                                href="/signout"
                                onClick={e => this.onSignout(e)}
                            >Sign Out</NavLink>
                        </NavItem>
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
    users: store.get('users'),
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
