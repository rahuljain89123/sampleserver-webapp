
import React from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Form,
    FormGroup,
    FormFeedback,
    Label,
    Input,
} from 'reactstrap'

import {
    fetchUser,
    fetchUsers,
    acceptInvite,
    signin,
    clearAcceptInviteError,
} from '../../actions/users'
import { msgFromError } from 'helpers/util'


class AcceptInviteForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            user: null,
            password: '',
        }
    }

    componentWillMount () {
        if (this.props.acceptInviteError) {
            this.props.clearAcceptInviteError()
        }
    }

    componentDidMount () {
        this.props.fetchUsers({ 'invite_code': this.props.code })
    }

    componentWillReceiveProps (nextProps) {
        if (!this.state.user) {
            this.setState({
                user: nextProps.users.first(),
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

        this.props.acceptInvite(this.state.user.get('id'), this.state.password)
            .then(() => {
                this.props.signin(this.state.user.get('email'), this.state.password)
                    .then(id => {
                        if (!this.props.users.get(id).get('name') ||
                            !this.props.users.get(id).get('phone')
                        ) {
                            this.props.push('/complete-profile')
                        } else {
                            this.props.push(this.props.from.pathname)
                        }
                    })
            })
    }

    render () {
        const email = this.state.user ? this.state.user.get('email') : ''
        const error = this.props.acceptInviteError
        const generalError = error && error.msg ? error.msg : null
        const errors = error && error.key ? {
            [error.key]: msgFromError(error),
        } : {}

        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        disabled
                    />
                </FormGroup>
                <FormGroup color={errors.password ? 'danger' : ''}>
                    <Label for="password">Password</Label>
                    <Input
                        state={errors.password ? 'danger' : ''}
                        type="password"
                        name="password"
                        id="password"
                        value={this.state.password}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.password}</FormFeedback>
                </FormGroup>
                <Button
                    role="button"
                    color="primary"
                    disabled={this.props.acceptingInvite}
                >Accept Invite</Button>
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
    fetchUsers: filters => dispatch(fetchUsers(filters)),
    acceptInvite: (email, password) => dispatch(acceptInvite(email, password)),
    signin: (email, password) => dispatch(signin(email, password)),
    clearAcceptInviteError: () => dispatch(clearAcceptInviteError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AcceptInviteForm)
