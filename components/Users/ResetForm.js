
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

import { finishReset, clearResetError } from '../../actions/users'
import { FormSuccessMessage } from '../Companies/FormMessages'


class ResetForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            password: '',
            success: false,
        }
    }

    componentWillMount () {
        if (this.props.resetError) {
            this.props.clearResetError()
        }
    }

    onChange (e) {
        if (this.props.resetError) {
            this.props.clearResetError()
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
        this.props.finishReset(this.props.code, this.state.password)
            .then(() => {
                this.setState({
                    success: true,
                })
            })
    }

    render () {
        const resetError = this.props.resetError

        if (!this.state.success) {
            return (
                <Form onSubmit={e => this.onSubmit(e)}>
                    <FormGroup color={resetError ? 'danger' : ''}>
                        <Label for="email">New password</Label>
                        <Input
                            state={resetError ? 'danger' : ''}
                            type="password"
                            name="password"
                            id="password"
                            value={this.state.password}
                            onChange={e => this.onChange(e)}
                        />
                        <FormFeedback>{resetError ? 'Invalid reset code or password.' : ''}</FormFeedback>
                    </FormGroup>
                    <Button
                        role="button"
                        color="primary"
                        disabled={this.props.resetting}
                    >Reset Password</Button>
                </Form>
            )
        }

        return (
            <FormSuccessMessage
                message={(
                    <span>
                        Successfully reset password.
                        <a href="/" onClick={e => this.onClick(e)}>Continue to sign in</a>.
                    </span>
                )}
            />
        )
    }
}

const mapStateToProps = store => ({
    resetError: store.get('resetError'),
    resetting: store.get('resetting'),
})

const mapDispatchToProps = dispatch => ({
    finishReset: (code, password) => dispatch(finishReset(code, password)),
    clearResetError: () => dispatch(clearResetError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetForm)
