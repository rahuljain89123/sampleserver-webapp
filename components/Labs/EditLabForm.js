
import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import { editLab, clearEditingLabError } from '../../actions/labs'
import { msgFromError } from '../../util'


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
                <FormGroup>
                    <Label for="shipping_company">Shipping Company</Label>
                    <Input
                        name="shipping_company"
                        id="shipping_company"
                        value={this.state.shipping_company}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="shipping_account">Shipping Account</Label>
                    <Input
                        name="shipping_account"
                        id="shipping_account"
                        value={this.state.shipping_account}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="shipping_notes">Shipping Notes</Label>
                    <Input
                        type="textarea"
                        name="shipping_notes"
                        value={this.state.shipping_notes}
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
    editingLabError: store.get('editingLabError'),
    editingLab: store.get('editingLab'),
})

const mapDispatchToProps = dispatch => ({
    editLab: (id, lab) => dispatch(editLab(id, lab)),
    clearEditingLabError: () => dispatch(clearEditingLabError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditLabForm)
