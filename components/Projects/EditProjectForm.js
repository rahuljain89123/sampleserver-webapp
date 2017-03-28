
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

import { fetchCompanies } from '../../actions/companies'
import { editProject, clearEditingProjectError } from '../../actions/projects'
import { msgFromError } from '../../util'


class EditProjectForm extends React.Component {
    constructor (props) {
        super(props)

        const user = (
            props.currentUser &&
            props.users.size
        ) ? (
            props.users.get(props.currentUser)
        ) : null

        this.state = {
            name: props.project.get('name', ''),
            company_id: props.project.get('company_id', ''),
            user,
        }
    }

    componentDidMount () {
        if (this.state.user) {
            this.props.fetchCompanies(this.state.user.get('lab_id'))
        }
    }

    componentWillReceiveProps (nextProps) {
        if (!this.state.user) {
            const user = (
                nextProps.currentUser &&
                nextProps.users.size
            ) ? (
                nextProps.users.get(nextProps.currentUser)
            ) : null

            this.setState({
                user,
            })

            if (user) {
                this.props.fetchCompanies(user.get('lab_id'))
            }
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
            company_id: parseInt(this.state.company_id, 10),
        })
        .then(id => this.props.push(`/app/projects/${id}`))
    }

    render () {
        const companies = this.props.companies.entrySeq()

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
                <FormGroup color={errors.company_id ? 'danger' : ''}>
                    <Label for="company_id">Company</Label>
                    <Input
                        state={errors.company_id ? 'danger' : ''}
                        type="select"
                        name="company_id"
                        id="company_id"
                        value={this.state.company_id}
                        onChange={e => this.onChange(e)}
                    >
                        <option>Choose a company...</option>
                        {companies.map(([id, item]) => (
                            <option key={id} value={item.get('id')}>{item.get('title')}</option>
                        ))}
                    </Input>
                    <FormFeedback>{errors.lab_id}</FormFeedback>
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
    currentUser: store.get('currentUser'),
    users: store.get('users'),
    editingProjectError: store.get('editingProjectError'),
    editingProject: store.get('editingProject'),
    companies: store.get('companies'),
})

const mapDispatchToProps = dispatch => ({
    fetchCompanies: labId => dispatch(fetchCompanies({ lab_id: labId })),
    editProject: (id, project) => dispatch(editProject(id, project)),
    clearEditingProjectError: () => dispatch(clearEditingProjectError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProjectForm)