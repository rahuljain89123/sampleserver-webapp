
import React from 'react'
import { connect } from 'react-redux'

import {
    fetchUser,
    acceptInvite,
    clearAcceptInviteError,
} from '../actions/users'

import {
    Button,
} from '../basecoat/Button'

import {
    Form,
    FormGroup,
    TextField,
} from '../basecoat/Form'

import { hashids } from '../util'


class AcceptInviteForm extends React.Component {
    constructor (props) {
        super(props)

        const userId = hashids.decode(this.props.code)[0]
        const user = this.props.users.get(userId)

        this.state = {
            userId,
            user,
            password: '',
        }
    }

    componentWillMount () {
        if (this.props.acceptInviteError) {
            this.props.clearAcceptInviteError()
        }
    }

    componentDidMount () {
        this.props.fetchUser(this.state.userId)
    }

    componentWillReceiveProps (nextProps) {
        if (!this.state.user) {
            this.setState({
                user: nextProps.users.get(this.state.userId),
            })
        }
    }

    onChange (e) {
        if (this.props.acceptInviteError) {
            this.props.clearAcceptInviteError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()

        this.props.acceptInvite(this.state.userId, this.state.password)
            .then(() => this.props.push('/signin'))
    }

    render () {
        const email = this.state.user ? this.state.user.get('email') : ''

        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <FormGroup error={this.props.acceptInviteError}>
                    <TextField
                        label="Email"
                        name="email"
                        value={email}
                        disabled
                    />
                </FormGroup>
                <FormGroup>
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={e => this.onChange(e)}
                        error={this.props.acceptInviteError ? 'Invalid invite or password' : null}
                    />
                </FormGroup>
                <div className="form-actions">
                    <Button
                        primary
                        disabled={this.props.acceptInviteProcessing}
                        type="submit"
                    >Accept Invite</Button>
                </div>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    users: store.get('users'),
    acceptInviteError: store.get('acceptInviteError'),
    acceptingInvite: store.get('acceptingInvite'),
})

const mapDispatchToProps = dispatch => ({
    fetchUser: id => dispatch(fetchUser(id)),
    acceptInvite: (email, password) => dispatch(acceptInvite(email, password)),
    clearAcceptInviteError: () => dispatch(clearAcceptInviteError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AcceptInviteForm)
