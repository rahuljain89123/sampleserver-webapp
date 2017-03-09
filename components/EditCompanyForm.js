
import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import { editCompany, clearEditingCompanyError } from '../actions/companies'
import { msgFromError } from '../util'


class EditCompanyForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            title: props.company.get('title'),
            address: props.company.get('address'),
            city: props.company.get('city'),
            state: props.company.get('state'),
            zip: props.company.get('zip'),
            phone: props.company.get('phone'),
            contact: props.company.get('contact'),
            cell: props.company.get('cell'),
            fax: props.company.get('fax'),
            email: props.company.get('email'),
            notes: props.company.get('notes'),
        }
    }

    componentWillMount () {
        if (this.props.editingCompanyError) {
            this.props.clearEditingCompanyError()
        }
    }

    onChange (e) {
        if (this.props.editingCompanyError) {
            this.props.clearEditingCompanyError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()
        this.props.editCompany(this.props.company.get('id'), {
            title: this.state.title,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip,
            phone: this.state.phone,
            contact: this.state.contact,
            cell: this.state.cell,
            fax: this.state.fax,
            email: this.state.email,
            notes: this.state.notes,
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
                <FormGroup>
                    <Label for="title">Title</Label>
                    <Input
                        name="title"
                        id="title"
                        value={this.state.title}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="address">Address</Label>
                    <Input
                        name="address"
                        id="address"
                        value={this.state.address}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="city">City</Label>
                    <Input
                        name="city"
                        id="city"
                        value={this.state.city}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="state">State</Label>
                    <Input
                        name="state"
                        id="state"
                        value={this.state.state}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="zip">Zip</Label>
                    <Input
                        name="zip"
                        id="zip"
                        value={this.state.zip}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="phone">Phone</Label>
                    <Input
                        name="phone"
                        id="phone"
                        value={this.state.phone}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="contact">Contact</Label>
                    <Input
                        name="contact"
                        id="contact"
                        value={this.state.contact}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="cell">Cell</Label>
                    <Input
                        name="cell"
                        id="cell"
                        value={this.state.cell}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="fax">Fax</Label>
                    <Input
                        name="fax"
                        id="fax"
                        value={this.state.fax}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                        name="email"
                        id="email"
                        value={this.state.email}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="notes">Notes</Label>
                    <Input
                        name="notes"
                        id="notes"
                        value={this.state.notes}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <Button
                    color="primary"
                    disabled={this.props.editingLab}
                >Save</Button>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    editingCompanyError: store.get('editingCompanyError'),
    editingCompany: store.get('editingCompany'),
})

const mapDispatchToProps = dispatch => ({
    editCompany: (id, company) => dispatch(editCompany(id, company)),
    clearEditingCompanyError: () => dispatch(clearEditingCompanyError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditCompanyForm)
