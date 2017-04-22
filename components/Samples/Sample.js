
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { Row, Col } from 'reactstrap'

import LinkButton from '../LinkButton'
import { fetchSample } from '../../actions/samples'
import EditSampleForm from './EditSampleForm'

const SampleInfo = props => (
    <div>
        <strong>Site: </strong><span>{props.sample.get('id')}</span><br />
        <strong>Date collected: </strong><span>{props.sample.get('date_collected')}</span><br />
        <strong>Date extracted: </strong><span>{props.sample.get('date_extracted')}</span><br />
        <strong>Date analyzed: </strong><span>{props.sample.get('date_analyzed')}</span><br />
    </div>
)

class Sample extends React.Component {
    constructor (props) {
        super(props)

        const sampleId = parseInt(props.match.params.id, 10)
        const sample = props.samples.get(sampleId)

        this.state = {
            sampleId,
            sample,
        }
    }

    componentDidMount () {
        if (!this.state.sample) {
            this.props.fetchSample(this.state.sampleId)
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            sample: nextProps.samples.get(this.state.sampleId),
        })
    }

    render () {
        const sample = this.state.sample

        if (!sample) {
            return null
        }

        return (
            <Switch>
                <Route
                    exact
                    path="/app/samples/:id"
                    render={() => (
                        <div className="card">
                            <div className="card-block">
                                <div className="card-title d-flex flex-row">
                                    <h4>Sample: {sample.get('id')}</h4>
                                    <span className="ml-auto">
                                        <LinkButton
                                            color="primary"
                                            href={`/app/samples/${sample.get('id')}/edit`}
                                        >Edit Sample</LinkButton>
                                    </span>
                                </div>
                                <SampleInfo sample={sample} />
                            </div>
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/app/samples/:id/edit"
                    render={() => (
                        <div className="card">
                            <div className="card-block">
                                <div className="card-title d-flex flex-row">
                                    <h4>Edit sample: {sample.get('id')}</h4>
                                    <LinkButton
                                        href={`/app/samples/${sample.get('id')}`}
                                        className="ml-auto"
                                    >Back</LinkButton>
                                </div>
                                <Row>
                                    <Col sm={6}>
                                        <EditSampleForm sample={sample} push={this.props.push} />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    )}
                />
            </Switch>
        )
    }
}

const mapStateToProps = store => ({
    samples: store.get('samples'),
})

const mapDispatchToProps = dispatch => ({
    fetchSample: id => dispatch(fetchSample(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sample)
