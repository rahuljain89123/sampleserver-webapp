
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, NavLink } from 'react-router-dom'
import {
    Button,
    Breadcrumb,
    BreadcrumbItem,
    Nav,
} from 'reactstrap'

import { fetchCompany } from '../../actions/companies'


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

                <Nav pills style={{ marginBottom: 20 }}>
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
                </Nav>

                <Switch>
                    <Route
                        exact
                        path="/app/clients/:id(\\d+)"
                        render={() => (
                            <div className="card">
                                <div className="card-block">
                                    <div className="card-title d-flex flex-row">
                                        <h4>Contacts</h4>
                                    </div>
                                    <div>
                                        Contact Component Here
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                    <Route
                        exact
                        path="/app/clients/:id(\\d+)/uploads"
                        render={() => (
                            <div className="card">
                                <div className="card-block">
                                    <div className="card-title d-flex flex-row">
                                        <h4>Uploads</h4>
                                        <Button className="ml-auto">New Upload</Button>
                                    </div>
                                    <div>
                                        Uploads Component Here
                                    </div>
                                </div>
                            </div>
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
