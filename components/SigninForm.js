
import React from 'react'
import { connect } from 'react-redux'

import { signin, clearSigninError } from '../actions/users'

import {
    Button,
} from '../basecoat/Button'

import {
    Form,
    FormGroup,
    TextField,
} from '../basecoat/Form'


class SigninForm extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            username: '',
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
        this.props.signin(this.state.username, this.state.password)
    }

    render () {
        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <FormGroup error={this.props.signinError}>
                    <TextField
                        label="Username"
                        name="username"
                        value={this.state.username}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={e => this.onChange(e)}
                        error={this.props.signinError ? 'Invalid username or password' : null}
                    />
                </FormGroup>
                <div className="form-actions">
                    <Button
                        primary
                        disabled={this.props.signinProcessing}
                        type="submit"
                    >Sign In</Button>
                </div>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    signinError: store.get('signinError'),
    signinProcessing: store.get('signinProcessing'),
})

const mapDispatchToProps = dispatch => ({
    signin: (username, password) => dispatch(signin(username, password)),
    clearSigninError: () => dispatch(clearSigninError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SigninForm)
