
import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import {
    fetchUser,
    acceptInvite,
    signin,
    clearAcceptInviteError,
} from '../../actions/users'
import { hashids } from '../../util'


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
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        value={this.state.password}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <Button
                    color="primary"
                    disabled={this.props.acceptInviteProcessing}
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
    acceptInvite: (email, password) => dispatch(acceptInvite(email, password)),
    signin: (email, password) => dispatch(signin(email, password)),
    clearAcceptInviteError: () => dispatch(clearAcceptInviteError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AcceptInviteForm)
