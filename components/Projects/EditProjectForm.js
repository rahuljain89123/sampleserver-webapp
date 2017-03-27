
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

import { editProject, clearEditingProjectError } from '../../actions/projects'
import { msgFromError } from '../../util'


class EditProjectForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            name: props.project.get('name', ''),
        }
    }

    componentWillMount () {
        if (this.props.editingProjectError) {
            this.props.clearEditingProjectError()
        }
    }

    onChange (e) {
        if (this.props.editingProjectError) {
            this.props.clearEditingProjectError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()
        this.props.editProject(this.props.project.get('id'), {
            name: this.state.name,
        })
        .then(id => this.props.push(`/app/projects/${id}`))
    }

    render () {
        const error = this.props.editingProjectError
        const generalError = error && error.msg ? error.msg : null
        const errors = error && error.key ? {
            [error.key]: msgFromError(error),
        } : {}

        return (
            <Form onSubmit={e => this.onSubmit(e)}>
                <FormGroup color={errors.name ? 'danger' : ''}>
                    <Label for="name">Name</Label>
                    <Input
                        state={errors.name ? 'danger' : ''}
                        name="name"
                        id="name"
                        value={this.state.name}
                        onChange={e => this.onChange(e)}
                    />
                    <FormFeedback>{errors.name}</FormFeedback>
                </FormGroup>
                <Button
                    color="primary"
                    disabled={this.props.editingProject}
                >Save</Button>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    editingProjectError: store.get('editingProjectError'),
    editingProject: store.get('editingProject'),
})

const mapDispatchToProps = dispatch => ({
    editProject: (id, project) => dispatch(editProject(id, project)),
    clearEditingProjectError: () => dispatch(clearEditingProjectError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProjectForm)
