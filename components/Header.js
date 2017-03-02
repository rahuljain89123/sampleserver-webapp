
import React from 'react'
import { connect } from 'react-redux'

import { Button } from '../basecoat/Button'

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
            <div className="columns clearfix" style={{ marginTop: 20, marginBottom: 20 }}>
                <div className="single-column">
                    <h3 className="float-left">SampleServe</h3>
                    { this.props.currentUser ? (
                        <Button
                            outline
                            className="float-right"
                            onClick={() => this.onSignout()}
                        >Sign Out</Button>
                    ) : (
                        <Button
                            outline
                            link
                            href="/signin"
                            className="float-right"
                        >Sign In</Button>
                    )}
                </div>
            </div>
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
