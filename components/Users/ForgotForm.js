
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

import { reset, clearResetError } from '../../actions/users'
import { FormSuccessMessage } from '../Companies/FormMessages'


class ForgotForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            email: '',
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

    onSubmit (e) {
        e.preventDefault()
        this.props.reset(this.state.email)
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
                        <Label for="email">Email</Label>
                        <Input
                            state={resetError ? 'danger' : ''}
                            type="email"
                            name="email"
                            id="email"
                            value={this.state.email}
                            onChange={e => this.onChange(e)}
                        />
                        <FormFeedback>{resetError ? 'Invalid email.' : ''}</FormFeedback>
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
                message="Check your email for a link to finish resetting your password."
            />
        )
    }
}

const mapStateToProps = store => ({
    resetError: store.get('resetError'),
    resetting: store.get('resetting'),
})

const mapDispatchToProps = dispatch => ({
    reset: email => dispatch(reset(email)),
    clearResetError: () => dispatch(clearResetError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotForm)
