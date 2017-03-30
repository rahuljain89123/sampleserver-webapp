
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

import { clearCreatingUserError, deleteUser, createUser } from '../../actions/users'
import { msgFromError } from '../../util'
import { FormSuccessMessage } from './FormMessages'
import { fetchCompany } from '../../actions/companies'
import { safeGet, currentLab } from '../../normalizers'


class LabContactForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            name: safeGet(props.user, 'name', ''),
            email: safeGet(props.user, 'email', ''),
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
        const userId = this.props.user ? this.props.user.get('id') : null
        if (userId) { this.props.deleteUser(userId) }
        this.props.createUser({
            email: this.state.email,
            name: this.state.name,
            lab_id: this.props.lab.get('id'),
            role_id: 4,
            companies: {
                add: [this.props.companyId],
                remove: [],
            },
        })
        .then(() => this.props.fetchCompany(this.props.companyId))
        .then(() => {
            this.setState({ showSuccessMessage: true })
            setTimeout(() => {
                this.setState({ showSuccessMessage: false })
            }, 3500)
        })
    }

    render () {
        const userError = this.props.creatingUserError
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
    creatingUserError: store.get('creatingUserError'),
    creatingUser: store.get('creatingUser'),
    lab: currentLab(store),
})

const mapDispatchToProps = dispatch => ({
    createUser: user => dispatch(createUser(user)),
    clearCreatingUserError: () => dispatch(clearCreatingUserError()),
    deleteUser: id => dispatch(deleteUser(id)),
    fetchCompany: id => dispatch(fetchCompany(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LabContactForm)
