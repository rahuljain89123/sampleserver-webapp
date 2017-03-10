
import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import { editSample, clearEditingSampleError } from '../actions/samples'
import { msgFromError } from '../util'


class EditSampleForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            date_collected: props.sample.get('date_collected'),
            date_extracted: props.sample.get('date_extracted'),
            date_analyzed: props.sample.get('date_analyzed'),
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
            date_collected: this.state.date_collected,
            date_extracted: this.state.date_extracted,
            date_analyzed: this.state.date_analyzed,
        })
        .then(id => this.props.push(`/app/samples/${id}`))
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
                    <Label for="date_collected">Date collected</Label>
                    <Input
                        name="date_collected"
                        id="date_collected"
                        value={this.state.date_collected}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="date_extracted">Date extracted</Label>
                    <Input
                        name="date_extracted"
                        id="date_extracted"
                        value={this.state.date_extracted}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="date_analyzed">Date analyzed</Label>
                    <Input
                        name="date_analyzed"
                        id="date_analyzed"
                        value={this.state.date_analyzed}
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
