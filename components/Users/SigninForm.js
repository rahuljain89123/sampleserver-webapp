
import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import { signin, clearSigninError } from '../../actions/users'


class SigninForm extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            email: '',
            password: '',
        }
    }

    componentWillMount () {
        if (this.props.signinError) {
            this.props.clearSigninError()
        }
    }

    onChange (e) {
        if (this.props.signinError) {
            this.props.clearSigninError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()
        this.props.signin(this.state.email, this.state.password)
            .then(id => {
                if (!this.props.users.get(id).get('name') ||
                    !this.props.users.get(id).get('phone')
                ) {
                    this.props.push('/complete-profile')
                } else {
                    this.props.push(this.props.from.pathname)
                }
            })
    }

    render () {
        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        value={this.state.email}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <Button
                    color="primary"
                    disabled={this.props.signinProcessing}
                >Sign In</Button>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    users: store.get('users'),
    currentUser: store.get('currentUser'),
    signinError: store.get('signinError'),
    signinProcessing: store.get('signinProcessing'),
})

const mapDispatchToProps = dispatch => ({
    signin: (email, password) => dispatch(signin(email, password)),
    clearSigninError: () => dispatch(clearSigninError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SigninForm)
