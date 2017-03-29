
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

import { clearEditingUserError, deleteUser, createUser } from '../../actions/users'
import { msgFromError } from '../../util'
import { FormSuccessMessage } from './FormMessages'
import { fetchCompany } from '../../actions/companies'


class LabContactForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            name: props.user.get('name', ''),
            email: props.user.get('email', ''),
        }
    }

    componentWillMount () {
        if (this.props.editingUserError) {
            this.props.clearEditingUserError()
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
        this.props.deleteUser(this.props.user.get('id')).then(() =>
            this.props.createUser({
                email: this.state.email,
                name: this.state.name,
                lab_id: this.props.user.get('lab_id'),
                role_id: this.props.user.get('role_id'),
                companies: {
                    add: [this.props.companyId],
                    remove: [],
                },
            }).then(() => this.props.fetchCompany(this.props.companyId))
        )
        .then(() => {
            this.setState({ showSuccessMessage: true })
            setTimeout(() => {
                this.setState({ showSuccessMessage: false })
            }, 3500)
        })
    }

    render () {
        const userError = this.props.editingUserError
        const generalUserError = userError && userError.msg ? userError.msg : null
        const userErrors = userError && userError.key ? {
            [userError.key]: msgFromError(userError),
        } : {}

        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <h5 style={{ marginTop: 30, marginBottom: 20 }}>Primary Contact</h5>
                <FormGroup color={userErrors.name ? 'danger' : ''}>
                    <Label for="name">Full Name</Label>
                    <Input
                        state={userErrors.name ? 'danger' : ''}
                        name="name"
                        id="name"
                        value={this.state.name}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{userErrors.name}</FormFeedback>
                </FormGroup>
                <FormGroup color={userErrors.email ? 'danger' : ''}>
                    <Label for="email">Email</Label>
                    <Input
                        state={userErrors.email ? 'danger' : ''}
                        name="email"
                        id="email"
                        value={this.state.email}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{userErrors.email}</FormFeedback>
                </FormGroup>
                <Button
                    color="success"
                    disabled={this.props.editingUser}
                >Update Contact</Button>
                { this.state.showSuccessMessage ? (
                    <FormSuccessMessage message="Successfully saved contact!" />
                    ) : null
                }
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    editingUserError: store.get('editingUserError'),
    editingUser: store.get('editingUser'),
})

const mapDispatchToProps = dispatch => ({
    createUser: user => dispatch(createUser(user)),
    deleteUser: id => dispatch(deleteUser(id)),
    clearEditingUserError: () => dispatch(clearEditingUserError()),
    fetchCompany: id => dispatch(fetchCompany(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LabContactForm)
