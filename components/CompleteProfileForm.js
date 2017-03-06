
import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import { editUser, clearEditingUserError } from '../actions/users'
import { msgFromError } from '../util'


class CompleteProfileForm extends React.Component {
    constructor (props) {
        super(props)

        const user = props.users.get(props.currentUser)
        const email = user && user.get('email') ? user.get('email') : ''
        const name = user && user.get('name') ? user.get('name') : ''
        const phone = user && user.get('phone') ? user.get('phone') : ''

        this.state = {
            user,
            email,
            name,
            phone,
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
            const email = user && user.get('email') ? user.get('email') : ''
            const name = user && user.get('name') ? user.get('name') : ''
            const phone = user && user.get('phone') ? user.get('phone') : ''

            this.setState({
                user,
                email,
                name,
                phone,
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
            name: this.state.name,
            phone: this.state.phone,
        })
        .then(() => {
            this.props.push('/app')
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
                <FormGroup>
                    <Label for="name">Full name</Label>
                    <Input
                        name="name"
                        id="name"
                        value={this.state.name}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="phone">Phone number</Label>
                    <Input
                        name="phone"
                        id="phone"
                        value={this.state.phone}
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
