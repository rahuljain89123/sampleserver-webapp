
import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

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
                        id="password"
                        value={this.state.password}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <Button
                    color="primary"
                    disabled={this.props.creatingUser}
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
