
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

import { fetchLabs } from '../../actions/labs'
import { fetchRoles } from '../../actions/roles'
import { editUser, clearEditingUserError } from '../../actions/users'
import { msgFromError } from '../../util'


class EditUserForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            email: props.user.get('email'),
            name: props.user.get('name'),
            phone: props.user.get('phone'),
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
            name: this.state.name,
            phone: this.state.phone,
            role_id: this.state.role_id,
            lab_id: this.state.lab_id,
        })
        .then(id => this.props.push(`/app/users/${id}`))
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
                <FormGroup color={errors.email ? 'danger' : ''}>
                    <Label for="email">Email</Label>
                    <Input
                        state={errors.email ? 'danger' : ''}
                        type="email"
                        name="email"
                        id="email"
                        value={this.state.email}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.email}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.name ? 'danger' : ''}>
                    <Label for="name">Full name</Label>
                    <Input
                        state={errors.name ? 'danger' : ''}
                        name="name"
                        id="name"
                        value={this.state.name}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.name}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.phone ? 'danger' : ''}>
                    <Label for="phone">Phone number</Label>
                    <Input
                        state={errors.phone ? 'danger' : ''}
                        name="phone"
                        id="phone"
                        value={this.state.phone}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.phone}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.lab_id ? 'danger' : ''}>
                    <Label for="lab_id">Lab</Label>
                    <Input
                        state={errors.lab_id ? 'danger' : ''}
                        type="select"
                        name="lab_id"
                        id="lab_id"
                        value={this.state.lab_id}
                        onChange={e => this.onChange(e)}
                    >
                        <option>Choose a lab...</option>
                        {labs.map(([id, item]) => (
                            <option key={id} value={item.get('laboratory_id')}>{item.get('title')}</option>
                        ))}
                    </Input>
                    <FormFeedback>{errors.lab_id}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.role_id ? 'danger' : ''}>
                    <Label for="role_id">Role</Label>
                    <Input
                        state={errors.role_id ? 'danger' : ''}
                        type="select"
                        name="role_id"
                        id="role_id"
                        value={this.state.role_id}
                        onChange={e => this.onChange(e)}
                    >
                        <option>Choose a role...</option>
                        {roles.map(([id, item]) => (
                            <option key={id} value={item.get('id')}>{item.get('name')}</option>
                        ))}
                    </Input>
                    <FormFeedback>{errors.role_id}</FormFeedback>
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
