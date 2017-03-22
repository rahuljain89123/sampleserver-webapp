
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
    DropdownItem
} from 'reactstrap'
import ReactFilepicker from 'react-filestack'

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

        const options = {
            accept: 'image/*',
            fromSources: ['local_file_system', 'dropbox'],
        }

        function filepickerCallback (obj) {
            console.log(obj)
        }

        return (
            <Navbar
                color="faded"
                light
                className="flex-row justify-content-end"
                style={{ marginBottom: 20 }}
            >
                <NavbarBrand className="mr-auto">SampleServe</NavbarBrand>
                { this.props.currentUser ? (
                    <Nav className="">
                        <NavItem>
                            <ReactFilepicker apikey={'ATg3pguKNRI2jg6wRHiydz'} buttonText="Upload Files" buttonClass="btn btn-primary" options={options} onSuccess={filepickerCallback} />
                        </NavItem>
                        {!!user && !!role && (
                            <Dropdown isOpen={this.state.dropdownOpen} toggle={() => this.toggle()}>
                                <DropdownToggle caret>
                                    {`${user.get('email')}`}
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem header>{role.get('description')}</DropdownItem>
                                    <DropdownItem onClick={e => this.onSignout(e)}>
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
