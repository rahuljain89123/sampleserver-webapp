
import React from 'react'
import { connect } from 'react-redux'
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap'

import { fetchCurrentUser, signout } from '../actions/users'
import { fetchCurrentLab } from '../actions/labs'
import { fetchRoles } from '../actions/roles'

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

        const lab = this.props.labs.filter(fLab => fLab.get('url') === this.props.currentLabUrl).first()

        return (
            <Navbar
                color="faded"
                light
                className="flex-row justify-content-end"
                style={{ marginBottom: 20 }}
            >
                <NavbarBrand className="mr-auto">{lab ? lab.get('title') : 'SampleServe'}</NavbarBrand>
                { this.props.currentUser ? (
                    <Nav className="">
                        {!!user && !!role && (
                            <Dropdown isOpen={this.state.dropdownOpen} toggle={() => this.toggle()}>
                                <DropdownToggle caret className="pointer">
                                    {`${user.get('email')}`}
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem header>{role.get('description')}</DropdownItem>
                                    <DropdownItem onClick={e => this.onSignout(e)} className="pointer">
                                        Sign Out
                                    </DropdownItem>
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
    users: store.get('users'),
    roles: store.get('roles'),
    labs: store.get('labs'),
    currentLabUrl: store.get('currentLabUrl'),
    currentUser: store.get('currentUser'),
})

const mapDispatchToProps = dispatch => ({
    fetchCurrentUser: () => dispatch(fetchCurrentUser()),
    fetchCurrentLab: () => dispatch(fetchCurrentLab()),
    fetchRoles: () => dispatch(fetchRoles()),
    signout: () => dispatch(signout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
