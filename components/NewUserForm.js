
import React from 'react'
import { connect } from 'react-redux'

import {
    Button,
} from '../basecoat/Button'

import {
    Form,
    FormGroup,
    TextField,
} from '../basecoat/Form'

import { createUser, clearCreatingUserError } from '../actions/users'
import { msgFromError } from '../util'


class NewUserForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            email: '',
            password: '',
        }
    }

    componentWillMount () {
        if (this.props.creatingUserError) {
            this.props.clearCreatingUserError()
        }
    }

    onChange (e) {
        if (this.props.creatingUserError) {
            this.props.clearCreatingUserError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()
        this.props.createUser({
            email: this.state.email,
            password: this.state.password,
        })
        .then(id => this.props.push(`/app/users/${id}`))
    }

    render () {
        const error = this.props.creatingUserError
        const generalError = error && error.msg ? error.msg : null
        const errors = error && error.key ? {
            [error.key]: msgFromError(error),
        } : {}

        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <FormGroup error={generalError}>
                    <TextField
                        label="Email"
                        name="email"
                        value={this.state.email}
                        onChange={e => this.onChange(e)}
                        error={errors.email}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={e => this.onChange(e)}
                        error={errors.password || generalError}
                    />
                </FormGroup>
                <Button
                    primary
                    disabled={this.props.creatingUser}
                    type="submit"
                >Save</Button>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    creatingUserError: store.get('creatingUserError'),
    creatingUser: store.get('creatingUser'),
    users: store.get('users'),
})

const mapDispatchToProps = dispatch => ({
    createUser: user => dispatch(createUser(user)),
    clearCreatingUserError: () => dispatch(clearCreatingUserError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewUserForm)
