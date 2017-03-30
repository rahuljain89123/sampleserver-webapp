
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, NavLink } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    Nav,
} from 'reactstrap'


import { fetchCompany } from '../../actions/companies'

import CompanyUploads from './CompanyUploads'
import CompanySettings from './CompanySettings'
import LabClientContacts from './LabClientContacts'


class LabClient extends React.Component {
    constructor (props) {
        super(props)

        const companyId = parseInt(props.match.params.id, 10)
        const company = props.companies.get(companyId)

        this.state = {
            companyId,
            company,
        }
    }

    componentDidMount () {
        if (!this.state.company) {
            this.props.fetchCompany(this.state.companyId)
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            company: nextProps.companies.get(this.state.companyId),
        })
    }

    onClick (e) {
        e.preventDefault()
        this.props.push(e.target.getAttribute('href'))
    }

    render () {
        const company = this.state.company

        if (!company) {
            return null
        }

        return (
            <div>
                <Breadcrumb tag="nav" style={{ marginBottom: 20 }}>
                    <BreadcrumbItem
                        tag="a"
                        href="/app"
                        onClick={e => this.onClick(e)}
                    >
                        Clients
                    </BreadcrumbItem>
                    <BreadcrumbItem className="active">
                        {company.get('title')}
                    </BreadcrumbItem>
                </Breadcrumb>

                <Nav pills style={{ marginBottom: 50 }}>
                    <NavLink
                        exact
                        to={`/app/clients/${company.get('id')}`}
                        className="nav-link"
                        activeClassName="active"
                    >Contacts</NavLink>
                    <NavLink
                        exact
                        to={`/app/clients/${company.get('id')}/uploads`}
                        className="nav-link"
                        activeClassName="active"
                    >Uploads</NavLink>
                    <NavLink
                        exact
                        to={`/app/clients/${company.get('id')}/settings`}
                        className="nav-link"
                        activeClassName="active"
                    >Settings</NavLink>
                </Nav>

                <Switch>
                    <Route
                        exact
                        path="/app/clients/:id(\\d+)"
                        render={() => (
                            <div>
                                <h4>Contacts</h4>
                                <LabClientContacts company={company} />
                            </div>
                        )}
                    />
                    <Route
                        exact
                        path="/app/clients/:id(\\d+)/uploads"
                        render={() => (
                            <CompanyUploads company={company} />
                        )}
                    />
                    <Route
                        exact
                        path="/app/clients/:id(\\d+)/settings"
                        render={() => (
                            <CompanySettings company={company} />
                        )}
                    />
                </Switch>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    companies: store.get('companies'),
})

const mapDispatchToProps = dispatch => ({
    fetchCompany: id => dispatch(fetchCompany(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LabClient)
