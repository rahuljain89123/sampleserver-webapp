
import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import { editSample, setEditingSample, clearEditingSampleError } from '../actions/samples'
import { msgFromError } from '../util'


class EditSampleForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            sample_id: props.sample.get('sample_id'),
        }
    }

    componentWillMount () {
        if (this.props.editingSampleError) {
            this.props.clearEditingSampleError()
        }
    }

    onChange (e) {
        if (this.props.editingSampleError) {
            this.props.clearEditingSampleError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()
        this.props.editSample(this.props.sample.get('sample_id'), {
            sample_id: this.state.sample_id,
        })
    }

    render () {
        const error = this.props.editingSampleError
        const generalError = error && error.msg ? error.msg : null
        const errors = error && error.key ? {
            [error.key]: msgFromError(error),
        } : {}

        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <FormGroup>
                    <Label for="sample_id">ID</Label>
                    <Input
                        name="sample_id"
                        id="sample_id"
                        value={this.state.sample_id}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <Button
                    color="primary"
                    disabled={this.props.editingSample}
                >Save</Button>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    editingSampleError: store.get('editingSampleError'),
    editingSample: store.get('editingSample'),
})

const mapDispatchToProps = dispatch => ({
    editSample: (id, sample) => dispatch(editSample(id, sample)),
    clearEditingSampleError: () => dispatch(clearEditingSampleError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSampleForm)
