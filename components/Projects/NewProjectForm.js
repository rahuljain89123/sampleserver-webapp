
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

import { createProject, clearCreatingProjectError } from '../../actions/projects'
import { msgFromError } from 'helpers/util'
import { currentCompany } from '../../normalizers'
import { fetchCompanies } from '../../actions/companies'
import FormButton from 'SharedComponents/ReduxFormHelpers/FormButton'
import { flashMessage } from 'actions/global'


class NewProjectForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
    }
  }

  componentWillMount () {
    if (this.props.creatingProjectError) {
      this.props.clearCreatingProjectError()
    }
  }

  componentDidMount () {
    this.props.fetchCompanies()
  }

  onChange (e) {
    if (this.props.creatingProjectError) {
      this.props.clearCreatingProjectError()
    }

    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.createProject({
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
    const error = this.props.editingProjectError
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
          disabled={this.props.creatingProject}
        >Save</FormButton>
      </Form>
    )
  }
}

const mapStateToProps = store => ({
  company: currentCompany(store),
  creatingProjectError: store.get('creatingProjectError'),
  creatingProject: store.get('creatingProject'),
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  fetchCompanies: () => dispatch(fetchCompanies()),
  createProject: project => dispatch(createProject(project)),
  clearCreatingProjectError: () => dispatch(clearCreatingProjectError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewProjectForm)
