
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

import { editCompany, clearEditingCompanyError } from '../../actions/companies'
import { msgFromError } from '../../util'


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
                <FormGroup color={errors.title ? 'danger' : ''}>
                    <Label for="title">Title</Label>
                    <Input
                        state={errors.title ? 'danger' : ''}
                        name="title"
                        id="title"
                        value={this.state.title}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.title}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.address ? 'danger' : ''}>
                    <Label for="address">Address</Label>
                    <Input
                        state={errors.address ? 'danger' : ''}
                        name="address"
                        id="address"
                        value={this.state.address}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.address}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.city ? 'danger' : ''}>
                    <Label for="city">City</Label>
                    <Input
                        state={errors.city ? 'danger' : ''}
                        name="city"
                        id="city"
                        value={this.state.city}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.city}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.state ? 'danger' : ''}>
                    <Label for="state">State</Label>
                    <Input
                        state={errors.state ? 'danger' : ''}
                        name="state"
                        id="state"
                        value={this.state.state}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.state}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.zip ? 'danger' : ''}>
                    <Label for="zip">Zip</Label>
                    <Input
                        state={errors.zip ? 'danger' : ''}
                        name="zip"
                        id="zip"
                        value={this.state.zip}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.zip}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.phone ? 'danger' : ''}>
                    <Label for="phone">Phone</Label>
                    <Input
                        state={errors.phone ? 'danger' : ''}
                        name="phone"
                        id="phone"
                        value={this.state.phone}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.phone}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.contact ? 'danger' : ''}>
                    <Label for="contact">Contact</Label>
                    <Input
                        state={errors.contact ? 'danger' : ''}
                        name="contact"
                        id="contact"
                        value={this.state.contact}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.contact}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.cell ? 'danger' : ''}>
                    <Label for="cell">Cell</Label>
                    <Input
                        state={errors.cell ? 'danger' : ''}
                        name="cell"
                        id="cell"
                        value={this.state.cell}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.cell}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.fax ? 'danger' : ''}>
                    <Label for="fax">Fax</Label>
                    <Input
                        state={errors.fax ? 'danger' : ''}
                        name="fax"
                        id="fax"
                        value={this.state.fax}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.fax}</FormFeedback>
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
                <FormGroup color={errors.notes ? 'danger' : ''}>
                    <Label for="notes">Notes</Label>
                    <Input
                        state={errors.notes ? 'danger' : ''}
                        name="notes"
                        id="notes"
                        value={this.state.notes}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.notes}</FormFeedback>
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
