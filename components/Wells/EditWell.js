

import React from 'react'
import { connect } from 'react-redux'
import {
    Row,
    Col,
    Button,
} from 'reactstrap'

import { fetchWell, deleteWell } from '../../actions/wells'
import EditWellForm from './EditWellForm'


class EditWell extends React.Component {
    constructor (props) {
        super(props)

        const wellId = parseInt(props.match.params.id, 10)

        this.state = {
            wellId,
        }
    }

    componentDidMount () {
        this.props.fetchWell(this.state.wellId)
    }

    onDelete () {
        this.props.deleteWell(this.state.wellId)
            .then(() => this.props.onSuccess())
    }

    render () {
        const well = this.props.wells.get(this.state.wellId)

        if (!well) {
            return null
        }

        return (
            <Row>
                <Col sm={6}>
                    <div className="d-flex">
                        <h4>Edit Well</h4>
                        <Button
                            onClick={() => this.onDelete()}
                            className="ml-auto"
                            role="button"
                            color="danger"
                        >Delete Well</Button>
                    </div>
                    <EditWellForm
                        well={well}
                        onSuccess={this.props.onSuccess}
                    />
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = store => ({
    wells: store.get('wells'),
})

const mapDispatchToProps = dispatch => ({
    fetchWell: id => dispatch(fetchWell(id)),
    deleteWell: id => dispatch(deleteWell(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditWell)
