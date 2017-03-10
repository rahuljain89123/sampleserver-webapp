
import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import { createSite, clearCreatingSiteError } from '../actions/sites'
import { msgFromError } from '../util'


class NewSiteForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            title: '',
            contact: '',
            contact_phone: '',
            contact_email: '',
            notes: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            county: '',
            latitude: '',
            longitude: '',
            start_sampling_on: '',
            history: '',
            background: '',
            summary: '',
        }
    }

    componentWillMount () {
        if (this.props.creatingSiteError) {
            this.props.clearCreatingSiteError()
        }
    }

    onChange (e) {
        if (this.props.creatingSiteError) {
            this.props.clearCreatingSiteError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()
        this.props.createSite({
            title: this.state.title,
            contact: this.state.contact,
            contact_phone: this.state.contact_phone,
            contact_email: this.state.contact_email,
            notes: this.state.notes,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip,
            county: this.state.county,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            start_sampling_on: this.state.start_sampling_on,
            history: this.state.history,
            background: this.state.background,
            summary: this.state.summary,
        })
        .then(id => this.props.push(`/app/sites/${id}`))
    }

    render () {
        const error = this.props.editingSiteError
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
                    <Label for="contact">Contact</Label>
                    <Input
                        name="contact"
                        id="contact"
                        value={this.state.contact}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="contact_phone">Contact phone</Label>
                    <Input
                        name="contact_phone"
                        id="contact_phone"
                        value={this.state.contact_phone}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="contact_email">Contact email</Label>
                    <Input
                        name="contact_email"
                        id="contact_email"
                        value={this.state.contact_email}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="notes">Notes</Label>
                    <Input
                        type="textarea"
                        name="notes"
                        id="notes"
                        value={this.state.notes}
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
                    <Label for="county">County</Label>
                    <Input
                        name="county"
                        id="county"
                        value={this.state.county}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="latitude">Latitude</Label>
                    <Input
                        name="latitude"
                        id="latitude"
                        value={this.state.latitude}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="longitude">Longitude</Label>
                    <Input
                        name="longitude"
                        id="longitude"
                        value={this.state.longitude}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="start_sampling_on">Start sampling on</Label>
                    <Input
                        name="start_sampling_on"
                        id="start_sampling_on"
                        value={this.state.start_sampling_on}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="history">History</Label>
                    <Input
                        type="textarea"
                        name="history"
                        id="history"
                        value={this.state.history}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="background">Background</Label>
                    <Input
                        type="textarea"
                        name="background"
                        id="background"
                        value={this.state.background}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="summary">Summary</Label>
                    <Input
                        type="textarea"
                        name="summary"
                        id="summary"
                        value={this.state.summary}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <Button
                    color="primary"
                    disabled={this.props.creatingSite}
                >Save</Button>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    creatingSiteError: store.get('creatingSiteError'),
    creatingSite: store.get('creatingSite'),
})

const mapDispatchToProps = dispatch => ({
    createSite: site => dispatch(createSite(site)),
    clearCreatingSiteError: () => dispatch(clearCreatingSiteError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewSiteForm)
