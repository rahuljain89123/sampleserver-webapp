
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import {
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap'

import LinkButton from '../LinkButton'
import { fetchLab } from '../../actions/labs'
import EditLabForm from './EditLabForm'

const LabInfo = props => (
    <div>
        <strong>Address: </strong><span>{props.lab.get('address')}</span><br />
        <strong>City: </strong><span>{props.lab.get('city')}</span><br />
        <strong>State: </strong><span>{props.lab.get('state')}</span><br />
        <strong>Zip: </strong><span>{props.lab.get('zip')}</span><br />
        <strong>Phone: </strong><span>{props.lab.get('phone')}</span><br />
        <strong>Contact: </strong><span>{props.lab.get('contact')}</span><br />
        <strong>Cell: </strong><span>{props.lab.get('cell')}</span><br />
        <strong>Fax: </strong><span>{props.lab.get('fax')}</span><br />
        <strong>Email: </strong><span>{props.lab.get('email')}</span><br />
        <strong>Notes: </strong><span>{props.lab.get('notes')}</span><br />
        <strong>Shipping Company: </strong><span>{props.lab.get('shipping_company')}</span><br />
        <strong>Shipping Account: </strong><span>{props.lab.get('shipping_account')}</span><br />
        <strong>Shipping Notes: </strong><span>{props.lab.get('shipping_notes')}</span><br />
    </div>
)

class Lab extends React.Component {
    constructor (props) {
        super(props)

        const labId = parseInt(props.match.params.id, 10)
        const lab = props.labs.get(labId)

        this.state = {
            labId,
            lab,
        }
    }

    componentDidMount () {
        if (!this.state.lab) {
            this.props.fetchLab(this.state.labId)
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            lab: nextProps.labs.get(this.state.labId),
        })
    }

    onClick (e) {
        e.preventDefault()
        this.props.push(e.target.getAttribute('href'))
    }

    render () {
        const lab = this.state.lab

        if (!lab) {
            return null
        }

        return (
            <Switch>
                <Route
                    exact
                    path="/app/labs/:id"
                    render={() => (
                        <div>
                            <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
                                <BreadcrumbItem
                                    tag="a"
                                    href="/app/labs"
                                    onClick={e => this.onClick(e)}
                                >
                                    Labs
                                </BreadcrumbItem>
                                <BreadcrumbItem className="active">
                                    {lab.get('title')}
                                </BreadcrumbItem>
                            </Breadcrumb>
                            <div className="card">
                                <div className="card-block">
                                    <div className="card-title d-flex flex-row">
                                        <h4>{lab.get('title')}</h4>
                                        <span className="ml-auto">
                                            <LinkButton
                                                href={`/app/labs/${lab.get('id')}/users`}
                                            >Manage Users</LinkButton>
                                            <LinkButton
                                                color="primary"
                                                href={`/app/labs/${lab.get('id')}/edit`}
                                                style={{ marginLeft: 10 }}
                                            >Edit Lab</LinkButton>
                                        </span>
                                    </div>
                                    <LabInfo lab={lab} />
                                </div>
                            </div>
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/app/labs/:id/edit"
                    render={() => (
                        <div>
                            <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
                                <BreadcrumbItem
                                    tag="a"
                                    href="/app/labs"
                                    onClick={e => this.onClick(e)}
                                >
                                    Labs
                                </BreadcrumbItem>
                                <BreadcrumbItem
                                    tag="a"
                                    href={`/app/labs/${lab.get('id')}`}
                                    onClick={e => this.onClick(e)}
                                >
                                    {lab.get('title')}
                                </BreadcrumbItem>
                                <BreadcrumbItem className="active">
                                    Edit Lab
                                </BreadcrumbItem>
                            </Breadcrumb>
                            <div className="card">
                                <div className="card-block">
                                    <div className="card-title d-flex flex-row">
                                        <h4>{lab.get('title')}</h4>
                                        <LinkButton
                                            href={`/app/labs/${lab.get('id')}`}
                                            className="ml-auto"
                                        >Back</LinkButton>
                                    </div>
                                    <Row>
                                        <Col sm={6}>
                                            <EditLabForm lab={lab} push={this.props.push} />
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
    labs: store.get('labs'),
})

const mapDispatchToProps = dispatch => ({
    fetchLab: id => dispatch(fetchLab(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Lab)
