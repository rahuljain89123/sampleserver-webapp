
import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import { editSite, clearEditingSiteError } from '../actions/sites'
import { msgFromError } from '../util'


class EditLabForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            title: props.site.get('title'),
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
        this.props.editSite(this.props.site.get('site_id'), {
            title: this.state.title,
        })
    }

    render () {
        const error = this.props.editingSiteError
        const generalError = error && error.msg ? error.msg : null
        const errors = error && error.key ? {
            [error.key]: msgFromError(error),
        } : {}

        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <FormGroup>
                    <Label for="title">Title</Label>
                    <Input
                        name="title"
                        id="title"
                        value={this.state.title}
                        onChange={e => this.onChange(e)}
                    />
                </FormGroup>
                <Button
                    color="primary"
                    disabled={this.props.editingLab}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditLabForm)
