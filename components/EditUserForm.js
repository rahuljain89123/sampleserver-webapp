
import React from 'react'
import { connect } from 'react-redux'

import {
    Button,
} from '../basecoat/Button'

import {
    Form,
    FormGroup,
    TextField,
    Select,
    Option,
} from '../basecoat/Form'

import { fetchLabs } from '../actions/labs'
import { fetchRoles } from '../actions/roles'
import { editUser, clearEditingUserError } from '../actions/users'
import { msgFromError } from '../util'


class EditUserForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            email: props.user.get('email'),
            role_id: props.user.get('role_id'),
            lab_id: props.user.get('lab_id'),
        }
    }

    componentWillMount () {
        if (this.props.editingUserError) {
            this.props.clearEditingUserError()
        }
    }

    componentDidMount () {
        this.props.fetchRoles()
        this.props.fetchLabs()
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
        this.props.editUser(this.props.user.get('id'), {
            email: this.state.email,
            role_id: this.state.role_id,
            lab_id: this.state.lab_id,
        })
    }

    render () {
        const roles = this.props.roles.entrySeq()
        const labs = this.props.labs.entrySeq()
        const error = this.props.editingUserError
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
                        error={errors.email || generalError}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <Select
                        label="Lab"
                        name="lab_id"
                        value={this.state.lab_id}
                        onChange={e => this.onChange(e)}
                    >
                        <Option>Choose a lab...</Option>
                        {labs.map(([id, item]) => (
                            <Option key={id} value={item.get('laboratory_id')}>{item.get('title')}</Option>
                        ))}
                    </Select>
                </FormGroup>
                <FormGroup error={generalError}>
                    <Select
                        label="Role"
                        name="role_id"
                        value={this.state.role_id}
                        onChange={e => this.onChange(e)}
                    >
                        <Option>Choose a role...</Option>
                        {roles.map(([id, item]) => (
                            <Option key={id} value={item.get('id')}>{item.get('name')}</Option>
                        ))}
                    </Select>
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
    editingUserError: store.get('editingUserError'),
    editingUser: store.get('editingUser'),
    users: store.get('users'),
    roles: store.get('roles'),
    labs: store.get('labs').filter(lab => lab.get('title') !== ''),
})

const mapDispatchToProps = dispatch => ({
    fetchRoles: () => dispatch(fetchRoles()),
    fetchLabs: () => dispatch(fetchLabs()),
    editUser: (id, user) => dispatch(editUser(id, user)),
    clearEditingUserError: () => dispatch(clearEditingUserError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditUserForm)
