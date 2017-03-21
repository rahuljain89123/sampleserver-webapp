
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
import { msgFromError } from '../../util'


class NewLabClientForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            title: '',
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
        this.props.createCompany({
            title: this.state.title,
        })
        .then(id => this.props.push(`/app/companies/${id}`))
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
                <Button
                    color="primary"
                    disabled={this.props.creatingCompany}
                >Create Client</Button>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    creatingCompanyError: store.get('creatingCompanyError'),
    creatingCompany: store.get('creatingCompany'),
})

const mapDispatchToProps = dispatch => ({
    createCompany: company => dispatch(createCompany(company)),
    clearCreatingCompanyError: () => dispatch(clearCreatingCompanyError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewLabClientForm)
