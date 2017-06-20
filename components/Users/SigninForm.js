
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

import { signin, clearSigninError } from '../../actions/users'
import { fetchRoles } from '../../actions/roles'
import { currentUser } from '../../normalizers'


class SigninForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
    }
  }

  componentWillMount () {
    if (this.props.signinError) {
      this.props.clearSigninError()
    }
  }

  onChange (e) {
    if (this.props.signinError) {
      this.props.clearSigninError()
    }

    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onClick (e) {
    e.preventDefault()
    this.props.push(e.target.getAttribute('href'))
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.signin(this.state.email ? this.state.email.trim() : '', this.state.password)
      .then(() => {
        this.props.fetchRoles()

        if (!this.props.user.get('name') ||
          !this.props.user.get('phone')
        ) {
          this.props.push('/complete-profile')
        } else {
          this.props.push(this.props.from.pathname)
        }
      })
  }

  render () {
    const signinError = this.props.signinError

    return (
      <Form onSubmit={e => this.onSubmit(e)}>
        <FormGroup color={signinError ? 'danger' : ''}>
          <Label for="email">Email</Label>
          <Input
            state={signinError ? 'danger' : ''}
            type="email"
            name="email"
            id="email"
            value={this.state.email}
            onChange={e => this.onChange(e)}
          />
        </FormGroup>
        <FormGroup color={signinError ? 'danger' : ''}>
          <Label for="password">Password</Label>
          <Input
            state={signinError ? 'danger' : ''}
            type="password"
            name="password"
            value={this.state.password}
            onChange={e => this.onChange(e)}
          />
          <FormFeedback>{signinError ? 'Invalid email or password.' : ''}</FormFeedback>
        </FormGroup>
        <div className="d-flex">
          <Button
            role="button"
            color="primary"
            disabled={this.props.signinProcessing}
          >Sign In</Button>
          <Button
            color="link"
            href="/forgot"
            className="ml-auto"
            onClick={e => this.onClick(e)}
          >Forgot Password?</Button>
        </div>
      </Form>
    )
  }
}

const mapStateToProps = store => ({
  user: currentUser(store),
  signinError: store.get('signinError'),
  signinProcessing: store.get('signinProcessing'),
})

const mapDispatchToProps = dispatch => ({
  signin: (email, password) => dispatch(signin(email, password)),
  clearSigninError: () => dispatch(clearSigninError()),
  fetchRoles: () => dispatch(fetchRoles()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SigninForm)
