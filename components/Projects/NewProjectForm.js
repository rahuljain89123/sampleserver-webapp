
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

import { createProject, clearCreatingProjectError } from '../../actions/projects'
import { msgFromError } from '../../util'
import { currentCompany } from '../../normalizers'
import { fetchCompanies } from '../../actions/companies'


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
        .then(() => this.props.push('/app/'))
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
                    disabled={this.props.creatingProject}
                >Save</Button>
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
    fetchCompanies: () => dispatch(fetchCompanies()),
    createProject: project => dispatch(createProject(project)),
    clearCreatingProjectError: () => dispatch(clearCreatingProjectError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewProjectForm)
