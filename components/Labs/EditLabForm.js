
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

import { editLab, clearEditingLabError } from '../../actions/labs'
import { msgFromError } from '../../util'


class EditLabForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            title: props.lab.get('title', ''),
            address: props.lab.get('address', ''),
            city: props.lab.get('city', ''),
            state: props.lab.get('state', ''),
            zip: props.lab.get('zip', ''),
            phone: props.lab.get('phone', ''),
            contact: props.lab.get('contact', ''),
            cell: props.lab.get('cell', ''),
            fax: props.lab.get('fax', ''),
            email: props.lab.get('email', ''),
            notes: props.lab.get('notes', ''),
            shipping_company: props.lab.get('shipping_company', ''),
            shipping_account: props.lab.get('shipping_account', ''),
            shipping_notes: props.lab.get('shipping_notes', ''),
        }
    }

    componentWillMount () {
        if (this.props.editingLabError) {
            this.props.clearEditingLabError()
        }
    }

    onChange (e) {
        if (this.props.editingLabError) {
            this.props.clearEditingLabError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()
        this.props.editLab(this.props.lab.get('laboratory_id'), {
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
            shipping_company: this.state.shipping_company,
            shipping_account: this.state.shipping_account,
            shipping_notes: this.state.shipping_notes,
        })
        .then(id => this.props.push(`/app/labs/${id}`))
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
                <FormGroup color={errors.shipping_company ? 'danger' : ''}>
                    <Label for="shipping_company">Shipping Company</Label>
                    <Input
                        state={errors.shipping_company ? 'danger' : ''}
                        name="shipping_company"
                        id="shipping_company"
                        value={this.state.shipping_company}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.shipping_company}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.shipping_account ? 'danger' : ''}>
                    <Label for="shipping_account">Shipping Account</Label>
                    <Input
                        state={errors.shipping_account ? 'danger' : ''}
                        name="shipping_account"
                        id="shipping_account"
                        value={this.state.shipping_account}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.shipping_account}</FormFeedback>
                </FormGroup>
                <FormGroup color={errors.shipping_notes ? 'danger' : ''}>
                    <Label for="shipping_notes">Shipping Notes</Label>
                    <Input
                        state={errors.shipping_notes ? 'danger' : ''}
                        type="textarea"
                        name="shipping_notes"
                        value={this.state.shipping_notes}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.shipping_notes}</FormFeedback>
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
    editingLabError: store.get('editingLabError'),
    editingLab: store.get('editingLab'),
})

const mapDispatchToProps = dispatch => ({
    editLab: (id, lab) => dispatch(editLab(id, lab)),
    clearEditingLabError: () => dispatch(clearEditingLabError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditLabForm)
