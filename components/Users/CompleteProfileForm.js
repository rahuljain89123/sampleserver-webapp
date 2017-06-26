
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

import { editUser, clearEditingUserError } from 'actions/users'
import { flashMessage } from 'actions/global'

import { currentUser, safeGet } from '../../normalizers'
import { msgFromError } from 'helpers/util'
import UpdateProfileImage from './UpdateProfileImage'


class CompleteProfileForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loadedUser: !!this.props.user,
      email: safeGet(this.props.user, 'email', ''),
      name: safeGet(this.props.user, 'name', ''),
      phone: safeGet(this.props.user, 'phone', ''),
    }
  }

  componentDidMount () {

  }

  componentWillMount () {
    if (this.props.editingUserError) {
      this.props.clearEditingUserError()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.loadedUser) {
      this.setState({
        loadedUser: !!nextProps.user,
        email: safeGet(nextProps.user, 'email', ''),
        name: safeGet(nextProps.user, 'name', ''),
        phone: safeGet(nextProps.user, 'phone', ''),
      })
    }
  }

  onChange (e) {
    if (this.props.editingUserError) {
      this.props.clearEditingUserError()
    }

    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.editUser(this.props.user.get('id'), {
      email: this.state.email,
      name: this.state.name,
      phone: this.state.phone,
    })
    .then(() => {
      this.props.flashMessage('success', 'Profile updated')
      this.props.push('/app')
      window.analytics.track('profile updated')
    })
    .catch(() => this.props.flashMessage('STANDARD_ERROR'))
  }

  render () {
    const error = this.props.editingUserError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
      [error.key]: msgFromError(error),
    } : {}

    return (
      <Form onSubmit={e => this.onSubmit(e)}>
        <UpdateProfileImage user={this.props.user} name={this.state.name} />
        <FormGroup color={errors.email ? 'danger' : ''}>
          <Label for="email">Email</Label>
          <Input
            state={errors.email ? 'danger' : ''}
            type="email"
            name="email"
            id="email"
            value={this.state.email}
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.email}</FormFeedback>
        </FormGroup>
        <FormGroup color={errors.name ? 'danger' : ''}>
          <Label for="name">Full name</Label>
          <Input
            state={errors.name ? 'danger' : ''}
            name="name"
            id="name"
            value={this.state.name}
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.name}</FormFeedback>
        </FormGroup>
        <FormGroup color={errors.phone ? 'danger' : ''}>
          <Label for="phone">Phone number</Label>
          <Input
            state={errors.phone ? 'danger' : ''}
            name="phone"
            id="phone"
            value={this.state.phone}
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.phone}</FormFeedback>
        </FormGroup>
        <Button
          role="button"
          color="primary"
          disabled={this.props.editingUser}
        >Save</Button>
      </Form>
    )
  }
}

const mapStateToProps = store => ({
  user: currentUser(store),
  editingUserError: store.get('editingUserError'),
  editingUser: store.get('editingUser'),
})

const mapDispatchToProps = dispatch => ({
  editUser: (id, user) => dispatch(editUser(id, user)),
  clearEditingUserError: () => dispatch(clearEditingUserError()),
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompleteProfileForm)
