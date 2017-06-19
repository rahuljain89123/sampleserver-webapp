
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

import PrivateRoute from '../Auth'
import { fetchCompanies } from '../../actions/companies'
import { editClient, clearEditingClientError } from '../../actions/clients'
import { currentLab } from '../../normalizers'
import { msgFromError } from 'helpers/util'


class EditClientForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            fetchedCompanies: !!this.props.lab,
            name: props.client.get('name', ''),
            company_id: props.client.get('company_id', ''),
        }
    }

    componentDidMount () {
        if (this.props.lab) {
            this.props.fetchCompanies({ lab_id: this.props.lab.get('id') })
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.lab && !this.state.fetchedCompanies) {
            this.props.fetchCompanies({ lab_id: nextProps.lab.get('id') })

            this.setState({
                fetchCompanies: true,
            })
        }
    }

    componentWillMount () {
        if (this.props.editingClientError) {
            this.props.clearEditingClientError()
        }
    }

    onChange (e) {
        if (this.props.editingClientError) {
            this.props.clearEditingClientError()
        }

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onSubmit (e) {
        e.preventDefault()
        this.props.editClient(this.props.client.get('id'), {
            name: this.state.name,
            company_id: parseInt(this.state.company_id, 10),
        })
        .then(id => this.props.push(`/app/clients/${id}`))
    }

    render () {
        const companies = this.props.companies
            .filter(company => company.get('lab_id') === this.props.lab.get('id'))
            .map(company => ({ value: company.get('id'), label: company.get('title') }))
            .valueSeq().toJS()


        const error = this.props.editingClientError
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
                <PrivateRoute
                    path=""
                    authorized={['Admin', 'LabAdmin', 'LabAssociate']}
                    component={() => (
                        <FormGroup color={errors.company_id ? 'danger' : ''}>
                            <Label for="company_id">Company</Label>
                            <Select
                              state={errors.company_id ? 'danger' : ''}
                              placeholder="Choose a company..."
                              name="company_id"
                              id="company_id"
                              value={this.state.company_id}
                              onChange={v => this.onChange({target: {name: 'company_id', value: v.value }})}
                              options={companies}
                            />
                            <FormFeedback>{errors.lab_id}</FormFeedback>
                        </FormGroup>
                    )}
                />
                <Button
                    color="primary"
                    disabled={this.props.editingClient}
                >Save</Button>
            </Form>
        )
    }
}

const mapStateToProps = store => ({
    lab: currentLab(store),
    editingClientError: store.get('editingClientError'),
    editingClient: store.get('editingClient'),
    companies: store.get('companies'),
})

const mapDispatchToProps = dispatch => ({
    fetchCompanies: filters => dispatch(fetchCompanies(filters)),
    editClient: (id, client) => dispatch(editClient(id, client)),
    clearEditingClientError: () => dispatch(clearEditingClientError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditClientForm)
