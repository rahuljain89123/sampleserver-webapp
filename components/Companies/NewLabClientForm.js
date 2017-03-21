
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

import { createCompany, clearCreatingCompanyError } from '../../actions/companies'
import { createUser } from '../../actions/users'
import { msgFromError } from '../../util'


class NewLabClientForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            title: '',
            name: '',
            email: '',
        }
    }

    componentWillMount () {
        if (this.props.creatingCompanyError) {
            this.props.clearCreatingCompanyError()
        }
    }

    onChange (e) {
        if (this.props.creatingCompanyError) {
            this.props.clearCreatingCompanyError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()

        const lab = this.props.labs
            .filter(fLab => fLab.get('url') === this.props.currentLabUrl)
            .first()

        this.props.createCompany({
            title: this.state.title,
            lab_id: lab.get('id'),
        })
        .then(id => {
            this.props.createUser({
                email: this.state.email,
                name: this.state.name,
                lab_id: lab.get('id'),
                role_id: 4,  // company admin
                companies: {
                    add: [id],
                    remove: [],
                },
            })
            .then(() => this.props.push(`/app/clients/${id}`))
        })
    }

    render () {
        const error = this.props.editingLabError
        const generalError = error && error.msg ? error.msg : null
        const errors = error && error.key ? {
            [error.key]: msgFromError(error),
        } : {}

        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <FormGroup color={errors.title ? 'danger' : ''}>
                    <Label for="title">Company Name</Label>
                    <Input
                        state={errors.title ? 'danger' : ''}
                        name="title"
                        id="title"
                        value={this.state.title}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.title}</FormFeedback>
                </FormGroup>
                <h5 style={{ marginTop: 30, marginBottom: 20 }}>Primary Contact</h5>
                <FormGroup color={errors.name ? 'danger' : ''}>
                    <Label for="name">Full Name</Label>
                    <Input
                        state={errors.name ? 'danger' : ''}
                        name="name"
                        id="name"
                        value={this.state.name}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.name}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.email ? 'danger' : ''}>
                    <Label for="email">Email</Label>
                    <Input
                        state={errors.email ? 'danger' : ''}
                        name="email"
                        id="email"
                        value={this.state.email}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.email}</FormFeedback>
                </FormGroup>
                <Button
                    color="primary"
                    disabled={this.props.creatingCompany}
                >Create Client</Button>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    labs: store.get('labs'),
    currentLabUrl: store.get('currentLabUrl'),
    creatingCompanyError: store.get('creatingCompanyError'),
    creatingCompany: store.get('creatingCompany'),
})

const mapDispatchToProps = dispatch => ({
    createCompany: company => dispatch(createCompany(company)),
    createUser: user => dispatch(createUser(user)),
    clearCreatingCompanyError: () => dispatch(clearCreatingCompanyError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewLabClientForm)
