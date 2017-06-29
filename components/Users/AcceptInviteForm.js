
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

import {
    fetchUser,
    fetchUsers,
    acceptInvite,
    signin,
    clearAcceptInviteError,
} from 'actions/users'
import { flashMessage } from 'actions/global'
import { msgFromError } from 'helpers/util'
import { currentUser, loggedIn } from 'normalizers'

class AcceptInviteForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      user: null,
      password: '',
    }
  }

  componentWillMount () {
    if (this.props.acceptInviteError) {
      this.props.clearAcceptInviteError()
    }
  }

  componentDidMount () {
    // don't fetch users if we already have the user
    if (this.getUser(this.props.users)) {
      return
    }
    this.props.fetchUsers({ 'invite_code': this.props.code })
      .then((users) => {
        if ((!users.length || users[0].active)) {
          this.props.flashMessage('danger', 'This invite code is either invalid or has been used')
          this.props.push('/')
        }
      })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentUser && !nextProps.acceptedInvite) {
      this.props.flashMessage('danger', 'Please log out to accept this invitation.')
      this.props.push('/app')
    }
  }

  getUser (users) {
    return users.filter(user => user.get('invite_code') === this.props.code).first()
  }

  onChange (e) {
    if (this.props.acceptInviteError) {
      this.props.clearAcceptInviteError()
    }

    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onSubmit (e) {
    e.preventDefault()

    this.props.acceptInvite(this.getUser(this.props.users).get('id'), this.state.password)
      .then(() => {
        this.props.signin(this.getUser(this.props.users).get('email'), this.state.password)
          .then(id => {
            if (!this.props.users.get(id).get('name') ||
              !this.props.users.get(id).get('phone')
            ) {
              this.props.push('/complete-profile')
            } else {
              this.props.push(this.props.from.pathname)
            }
          })
      })
  }

  render () {
    const user = this.getUser(this.props.users)
    const email = user ? user.get('email') : ''
    const error = this.props.acceptInviteError
    const generalError = error && error.msg ? error.msg : null
    const errors = error && error.key ? {
      [error.key]: msgFromError(error),
    } : {}

    return (
      <Form onSubmit={e => this.onSubmit(e)}>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={email}
            disabled
          />
        </FormGroup>
        <FormGroup color={errors.password ? 'danger' : ''}>
          <Label for="password">Password</Label>
          <Input
            state={errors.password ? 'danger' : ''}
            type="password"
            name="password"
            id="password"
            value={this.state.password}
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{errors.password}</FormFeedback>
        </FormGroup>
        <Button
          role="button"
          color="primary"
          disabled={this.props.acceptingInvite}
        >Accept Invite</Button>
      </Form>
    )
  }
}

const mapStateToProps = store => ({
  users: store.get('users'),
  acceptInviteError: store.get('acceptInviteError'),
  acceptingInvite: store.get('acceptingInvite'),
  acceptedInvite: store.get('acceptedInvite'),
  currentUser: currentUser(store),
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  fetchUser: id => dispatch(fetchUser(id)),
  fetchUsers: filters => dispatch(fetchUsers(filters)),
  acceptInvite: (email, password) => dispatch(acceptInvite(email, password)),
  signin: (email, password) => dispatch(signin(email, password)),
  clearAcceptInviteError: () => dispatch(clearAcceptInviteError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AcceptInviteForm)
