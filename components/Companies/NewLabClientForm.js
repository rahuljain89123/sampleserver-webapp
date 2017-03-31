
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
import { createUser, clearCreatingUserError } from '../../actions/users'
import { currentLab } from '../../normalizers'
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

        if (this.props.creatingUserError) {
            this.props.clearCreatingUserError()
        }
    }

    onChange (e) {
        if (this.props.creatingCompanyError) {
            this.props.clearCreatingCompanyError()
        }

        if (this.props.creatingUserError) {
            this.props.clearCreatingUserError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()

        this.props.createCompany({
            title: this.state.title,
            lab_id: this.props.lab.get('id'),
            primary_user: {
                email: this.state.email,
                name: this.state.name,
                lab_id: this.props.lab.get('id'),
                role_id: 4,
            },
        })
        .then(id => this.props.push(`/app/clients/${id}`))
    }

    render () {
        const companyError = this.props.creatingCompanyError
        const userError = this.props.creatingUserError
        const generalCompanyError = companyError && companyError.msg ? companyError.msg : null
        const generalUserError = userError && userError.msg ? userError.msg : null
        const companyErrors = companyError && companyError.key ? {
            [companyError.key]: msgFromError(companyError),
        } : {}
        const userErrors = userError && userError.key ? {
            [userError.key]: msgFromError(userError),
        } : {}

        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <FormGroup color={companyErrors.title ? 'danger' : ''}>
                    <Label for="title">Company Name</Label>
                    <Input
                        state={companyErrors.title ? 'danger' : ''}
                        name="title"
                        id="title"
                        value={this.state.title}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{companyErrors.title}</FormFeedback>
                </FormGroup>
                <h5 style={{ marginTop: 30, marginBottom: 20 }}>Primary Contact</h5>
                <FormGroup color={companyErrors.name ? 'danger' : ''}>
                    <Label for="name">Full Name</Label>
                    <Input
                        state={companyErrors.name ? 'danger' : ''}
                        name="name"
                        id="name"
                        value={this.state.name}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{companyErrors.name}</FormFeedback>
                </FormGroup>
                <FormGroup color={companyErrors.email ? 'danger' : ''}>
                    <Label for="email">Email</Label>
                    <Input
                        state={companyErrors.email ? 'danger' : ''}
                        name="email"
                        id="email"
                        value={this.state.email}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{companyErrors.email}</FormFeedback>
                </FormGroup>
                <Button
                    color="primary"
                    disabled={this.props.creatingCompany || this.props.creatingUser}
                >Create Client</Button>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    lab: currentLab(store),
    creatingCompanyError: store.get('creatingCompanyError'),
    creatingCompany: store.get('creatingCompany'),
    creatingUserError: store.get('creatingUserError'),
    creatingUser: store.get('creatingUser'),
})

const mapDispatchToProps = dispatch => ({
    createCompany: company => dispatch(createCompany(company)),
    createUser: user => dispatch(createUser(user)),
    clearCreatingCompanyError: () => dispatch(clearCreatingCompanyError()),
    clearCreatingUserError: () => dispatch(clearCreatingUserError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewLabClientForm)
