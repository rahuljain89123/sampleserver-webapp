
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import {
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap'

import LinkButton from './LinkButton'
import EditCompanyForm from './EditCompanyForm'
import { fetchCompany } from '../actions/companies'

const CompanyInfo = props => (
    <div>
        <strong>Title: </strong><span>{props.company.get('title')}</span><br />
        <strong>Address: </strong><span>{props.company.get('address')}</span><br />
        <strong>City: </strong><span>{props.company.get('city')}</span><br />
        <strong>State: </strong><span>{props.company.get('state')}</span><br />
        <strong>Zip: </strong><span>{props.company.get('zip')}</span><br />
        <strong>Phone: </strong><span>{props.company.get('phone')}</span><br />
        <strong>Contact: </strong><span>{props.company.get('contact')}</span><br />
        <strong>Cell: </strong><span>{props.company.get('cell')}</span><br />
        <strong>Fax: </strong><span>{props.company.get('fax')}</span><br />
        <strong>Email: </strong><span>{props.company.get('email')}</span><br />
        <strong>Notes: </strong><span>{props.company.get('notes')}</span><br />
    </div>
)

class Company extends React.Component {
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
            <Switch>
                <Route
                    exact
                    path="/app/companies/:id(\\d+)"
                    render={() => (
                        <div>
                            <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
                                <BreadcrumbItem
                                    tag="a"
                                    href="/app/companies"
                                    onClick={e => this.onClick(e)}
                                >
                                    Companies
                                </BreadcrumbItem>
                                <BreadcrumbItem className="active">
                                    {company.get('title')}
                                </BreadcrumbItem>
                            </Breadcrumb>
                            <div className="card">
                                <div className="card-block">
                                    <div className="card-title d-flex flex-row">
                                        <h4>{company.get('title')}</h4>
                                        <span className="ml-auto">
                                            <LinkButton
                                                href={`/app/companies/${company.get('id')}/users`}
                                            >Manage Users</LinkButton>
                                            <LinkButton
                                                color="primary"
                                                href={`/app/companies/${company.get('id')}/edit`}
                                                style={{ marginLeft: 10 }}
                                            >Edit Company</LinkButton>
                                        </span>
                                    </div>
                                    <CompanyInfo company={company} />
                                </div>
                            </div>
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/app/companies/:id(\\d+)/edit"
                    render={() => (
                        <div>
                            <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
                                <BreadcrumbItem
                                    tag="a"
                                    href="/app/companies"
                                    onClick={e => this.onClick(e)}
                                >
                                    Companies
                                </BreadcrumbItem>
                                <BreadcrumbItem
                                    tag="a"
                                    href={`/app/companies/${company.get('id')}`}
                                    onClick={e => this.onClick(e)}
                                >
                                    {company.get('title')}
                                </BreadcrumbItem>
                                <BreadcrumbItem className="active">
                                    Edit Company
                                </BreadcrumbItem>
                            </Breadcrumb>
                            <div className="card">
                                <div className="card-block">
                                    <div className="card-title d-flex flex-row">
                                        <h4>{company.get('title')}</h4>
                                        <LinkButton
                                            href={`/app/companies/${company.get('id')}`}
                                            className="ml-auto"
                                        >Back</LinkButton>
                                    </div>
                                    <Row>
                                        <Col sm={6}>
                                            <EditCompanyForm
                                                company={company}
                                                push={this.props.push}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </Switch>
        )
    }
}

const mapStateToProps = store => ({
    companies: store.get('companies'),
})

const mapDispatchToProps = dispatch => ({
    fetchCompany: id => dispatch(fetchCompany(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Company)
