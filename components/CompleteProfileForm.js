
import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import { editUser, clearEditingUserError } from '../actions/users'
import { msgFromError } from '../util'


class CompleteProfileForm extends React.Component {
    constructor (props) {
        super(props)

        const user = props.users.get(props.currentUser)
        const email = user ? user.get('email') : ''

        this.state = {
            user,
            email,
        }
    }

    componentWillMount () {
        if (this.props.editingUserError) {
            this.props.clearEditingUserError()
        }
    }

    componentWillReceiveProps (nextProps) {
        if (!this.state.user) {
            const user = nextProps.users.get(nextProps.currentUser)
            const email = user ? user.get('email') : ''

            this.setState({
                user,
                email,
            })
        }
    }

    onChange (e) {
        if (this.props.editingUserError) {
            this.props.clearEditingUserError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()
        this.props.editUser(this.state.user.get('id'), {
            email: this.state.email,
        })
    }

    render () {
        const error = this.props.editingUserError
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
                <Button
                    color="primary"
                    disabled={this.props.editingUser}
                >Save</Button>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    users: store.get('users'),
    currentUser: store.get('currentUser'),
    editingUserError: store.get('editingUserError'),
    editingUser: store.get('editingUser'),
})

const mapDispatchToProps = dispatch => ({
    editUser: (id, user) => dispatch(editUser(id, user)),
    clearEditingUserError: () => dispatch(clearEditingUserError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompleteProfileForm)
