
import React from 'react'
import { connect } from 'react-redux'

import {
    Button,
} from '../basecoat/Button'

import {
    Form,
    FormGroup,
    TextField,
    TextArea,
} from '../basecoat/Form'

import { editLab, clearEditingLabError } from '../actions/labs'
import { msgFromError } from '../util'


class EditLabForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            title: props.lab.get('title'),
            address: props.lab.get('address'),
            city: props.lab.get('city'),
            state: props.lab.get('state'),
            zip: props.lab.get('zip'),
            phone: props.lab.get('phone'),
            contact: props.lab.get('contact'),
            cell: props.lab.get('cell'),
            fax: props.lab.get('fax'),
            email: props.lab.get('email'),
            notes: props.lab.get('notes'),
            shipping_company: props.lab.get('shipping_company'),
            shipping_account: props.lab.get('shipping_account'),
            shipping_notes: props.lab.get('shipping_notes'),
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
    }

    render () {
        const error = this.props.editingLabError
        const generalError = error && error.msg ? error.msg : null
        const errors = error && error.key ? {
            [error.key]: msgFromError(error),
        } : {}

        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <FormGroup error={generalError}>
                    <TextField
                        label="Title"
                        name="title"
                        value={this.state.title}
                        onChange={e => this.onChange(e)}
                        error={errors.title}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextField
                        label="Address"
                        name="address"
                        value={this.state.address}
                        onChange={e => this.onChange(e)}
                        error={errors.address}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextField
                        label="City"
                        name="city"
                        value={this.state.city}
                        onChange={e => this.onChange(e)}
                        error={errors.city}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextField
                        label="State"
                        name="state"
                        value={this.state.state}
                        onChange={e => this.onChange(e)}
                        error={errors.state}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextField
                        label="Zip"
                        name="zip"
                        value={this.state.zip}
                        onChange={e => this.onChange(e)}
                        error={errors.zip}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextField
                        label="Phone"
                        name="phone"
                        value={this.state.phone}
                        onChange={e => this.onChange(e)}
                        error={errors.phone}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextField
                        label="Contact"
                        name="contact"
                        value={this.state.contact}
                        onChange={e => this.onChange(e)}
                        error={errors.contact}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextField
                        label="Cell"
                        name="cell"
                        value={this.state.cell}
                        onChange={e => this.onChange(e)}
                        error={errors.cell}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextField
                        label="Fax"
                        name="fax"
                        value={this.state.fax}
                        onChange={e => this.onChange(e)}
                        error={errors.fax}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextField
                        label="Email"
                        name="email"
                        value={this.state.email}
                        onChange={e => this.onChange(e)}
                        error={errors.email}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextField
                        label="Notes"
                        name="notes"
                        value={this.state.notes}
                        onChange={e => this.onChange(e)}
                        error={errors.notes}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextField
                        label="Shipping Company"
                        name="shipping_company"
                        value={this.state.shipping_company}
                        onChange={e => this.onChange(e)}
                        error={errors.shipping_company}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextField
                        label="Shipping Account"
                        name="shipping_account"
                        value={this.state.shipping_account}
                        onChange={e => this.onChange(e)}
                        error={errors.shipping_account}
                    />
                </FormGroup>
                <FormGroup error={generalError}>
                    <TextArea
                        label="Shipping Notes"
                        name="shipping_notes"
                        value={this.state.shipping_notes}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <Button
                    primary
                    disabled={this.props.editingLab}
                    type="submit"
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
