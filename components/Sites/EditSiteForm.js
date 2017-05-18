
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
import STATES from 'helpers/states'

import { editSite, clearEditingSiteError } from 'actions/sites'
import { msgFromError } from 'util'


class EditSiteForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      title: props.site.get('title', ''),
      contact: props.site.get('contact', ''),
      contact_phone: props.site.get('contact_phone', ''),
      contact_email: props.site.get('contact_email', ''),
      notes: props.site.get('notes', ''),
      address: props.site.get('address', ''),
      city: props.site.get('city', ''),
      state_id: props.site.get('state_id', ''),
      zip: props.site.get('zip', ''),
      county: props.site.get('county', ''),
      latitude: props.site.get('latitude', ''),
      longitude: props.site.get('longitude', ''),
      start_sampling_on: props.site.get('start_sampling_on', ''),
      history: props.site.get('history', ''),
      background: props.site.get('background', ''),
      summary: props.site.get('summary', ''),
    }
  }

  componentWillMount () {
    if (this.props.editingSiteError) {
      this.props.clearEditingSiteError()
    }
  }

  onChange (e) {
    if (this.props.editingSiteError) {
      this.props.clearEditingSiteError()
    }

    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.editSite(this.props.site.get('id'), {
      title: this.state.title,
      contact: this.state.contact,
      contact_phone: this.state.contact_phone,
      contact_email: this.state.contact_email,
      notes: this.state.notes,
      address: this.state.address,
      city: this.state.city,
      state_id: parseInt(this.state.state_id),
      zip: this.state.zip,
      county: this.state.county,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      start_sampling_on: this.state.start_sampling_on,
      history: this.state.history,
      background: this.state.background,
      summary: this.state.summary,
    })
    .then(this.props.onSuccess)
  }

  render () {
    const error = this.props.editingSiteError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
      [error.key]: msgFromError(error),
    } : {}

    return (
      <Form onSubmit={e => this.onSubmit(e)}>
        <FormGroup color={errors.title ? 'danger' : ''}>
          <Label for="title">Site name</Label>
          <Input
            state={errors.title ? 'danger' : ''}
            name="title"
            id="title"
            value={this.state.title}
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.title}</FormFeedback>
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
        <FormGroup color={errors.contact_phone ? 'danger' : ''}>
          <Label for="contact_phone">Contact phone</Label>
          <Input
            state={errors.contact_phone ? 'danger' : ''}
            name="contact_phone"
            id="contact_phone"
            value={this.state.contact_phone}
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.contact_phone}</FormFeedback>
        </FormGroup>
        <FormGroup color={errors.contact_email ? 'danger' : ''}>
          <Label for="contact_email">Contact email</Label>
          <Input
            state={errors.contact_email ? 'danger' : ''}
            name="contact_email"
            id="contact_email"
            value={this.state.contact_email}
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.contact_email}</FormFeedback>
        </FormGroup>
        <FormGroup color={errors.notes ? 'danger' : ''}>
          <Label for="notes">Notes</Label>
          <Input
            state={errors.notes ? 'danger' : ''}
            type="textarea"
            name="notes"
            id="notes"
            value={this.state.notes}
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.notes}</FormFeedback>
        </FormGroup>
        <FormGroup color={errors.address ? 'danger' : ''}>
          <Label for="address">Address</Label>
          <Input
            state={errors.address ? 'danger' : ''}
            name="address"
            id="address"
            value={this.state.address}
            placeholder="Street Address"
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
            placeholder="City"
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.city}</FormFeedback>
        </FormGroup>
        <FormGroup color={errors.state_id ? 'danger' : ''}>
          <Label for="state_id">State</Label>
          <Input
            state={errors.state_id ? 'danger' : ''}
            name="state_id"
            id="state_id"
            value={this.state.state_id}
            type="select"
            onChange={e => this.onChange(e)}>
            <option> Choose a state... </option>
            {STATES.map((state) => (
              <option key={state.state_id} value={state.state_id}>{state.title}</option>)
            )}
          </Input>
          <FormFeedback>{errors.state_id}</FormFeedback>
        </FormGroup>
        <FormGroup color={errors.zip ? 'danger' : ''}>
          <Label for="zip">Zip</Label>
          <Input
            state={errors.zip ? 'danger' : ''}
            name="zip"
            id="zip"
            value={this.state.zip}
            placeholder="Zip Code"
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.zip}</FormFeedback>
        </FormGroup>
        <FormGroup color={errors.county ? 'danger' : ''}>
          <Label for="county">County</Label>
          <Input
            state={errors.county ? 'danger' : ''}
            name="county"
            id="county"
            value={this.state.county}
            placeholder="Country"
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.county}</FormFeedback>
        </FormGroup>
        <FormGroup color={errors.latitude ? 'danger' : ''}>
          <Label for="latitude">Latitude</Label>
          <Input
            state={errors.latitude ? 'danger' : ''}
            name="latitude"
            id="latitude"
            value={this.state.latitude}
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.latitude}</FormFeedback>
        </FormGroup>
        <FormGroup color={errors.longitude ? 'danger' : ''}>
          <Label for="longitude">Longitude</Label>
          <Input
            state={errors.longitude ? 'danger' : ''}
            name="longitude"
            id="longitude"
            value={this.state.longitude}
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.longitude}</FormFeedback>
        </FormGroup>
        <FormGroup color={errors.start_sampling_on ? 'danger' : ''}>
          <Label for="start_sampling_on">Start sampling on</Label>
          <Input
            state={errors.start_sampling_on ? 'danger' : ''}
            name="start_sampling_on"
            id="start_sampling_on"
            value={this.state.start_sampling_on}
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.start_sampling_on}</FormFeedback>
        </FormGroup>
        <Button
          color="primary"
          disabled={this.props.editingSite}
        >Save</Button>
      </Form>
    )
  }
}

const mapStateToProps = store => ({
  editingSiteError: store.get('editingSiteError'),
  editingSite: store.get('editingSite'),
})

const mapDispatchToProps = dispatch => ({
  editSite: (id, site) => dispatch(editSite(id, site)),
  clearEditingSiteError: () => dispatch(clearEditingSiteError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSiteForm)
