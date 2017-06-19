
import React from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Row,
  Col,
} from 'reactstrap'

import { createClient, clearCreatingClientError } from '../../actions/clients'
import { msgFromError } from 'helpers/util'
import { currentCompany } from '../../normalizers'
import { fetchCompanies } from '../../actions/companies'
import FormButton from 'SharedComponents/ReduxFormHelpers/FormButton'
import { flashMessage } from 'actions/global'


class NewClientForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
    }
  }

  componentWillMount () {
    if (this.props.creatingClientError) {
      this.props.clearCreatingClientError()
    }
  }

  componentDidMount () {
    this.props.fetchCompanies()
  }

  onChange (e) {
    if (this.props.creatingClientError) {
      this.props.clearCreatingClientError()
    }

    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.createClient({
      name: this.state.name,
      company_id: this.props.company.get('id'),
    })
    .then(() => {
      this.props.push('/app/')
      this.props.flashMessage('success', 'Site updated successfully')
    })
    .catch((e) => this.props.flashMessage('danger', 'Sorry, there was an error.'))
  }

  render () {
    const error = this.props.editingClientError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
      [error.key]: msgFromError(error),
    } : {}

    return (
      <Form onSubmit={e => this.onSubmit(e)}>
        <FormGroup row color={errors.name ? 'danger' : ''}>
          <Label sm={2} for="name">Name</Label>
          <Col sm={9}>
            <Input
              state={errors.name ? 'danger' : ''}
              name="name"
              id="name"
              value={this.state.name}
              onChange={e => this.onChange(e)}
            />
          </Col>
          <FormFeedback>{errors.name}</FormFeedback>
        </FormGroup>
        <FormButton
          color="primary"
          disabled={this.props.creatingClient}
        >Save</FormButton>
      </Form>
    )
  }
}

const mapStateToProps = store => ({
  company: currentCompany(store),
  creatingClientError: store.get('creatingClientError'),
  creatingClient: store.get('creatingClient'),
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  fetchCompanies: () => dispatch(fetchCompanies()),
  createClient: client => dispatch(createClient(client)),
  clearCreatingClientError: () => dispatch(clearCreatingClientError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewClientForm)
