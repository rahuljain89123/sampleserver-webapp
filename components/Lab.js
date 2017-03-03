
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import { Button } from '../basecoat/Button'

import EditLabForm from './EditLabForm'
import { fetchLab } from '../actions/labs'

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

    render () {
        const lab = this.state.lab

        if (!lab) {
            return null
        }

        return (
            <Switch>
                <Route
                    exact
                    path="/app/labs/:id(\\d+)"
                    render={() => (
                        <div>
                            <div className="clearfix">
                                <h3 className="float-left">Lab: {lab.get('title')}</h3>
                                <Button
                                    primary
                                    link
                                    href={`/app/labs/${this.props.match.params.id}/edit`}
                                    className="float-right"
                                >Edit Lab</Button>
                            </div>
                            <LabInfo lab={lab} />
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/app/labs/:id(\\d+)/edit"
                    render={() => (
                        <div style={{ marginBottom: 50 }}>
                            <div className="clearfix">
                                <h3 className="float-left">Edit lab: {lab.get('title')}</h3>
                                <Button
                                    link
                                    href={`/app/labs/${this.props.match.params.id}`}
                                    className="float-right"
                                >Back</Button>
                            </div>
                            <EditLabForm lab={lab} />
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
