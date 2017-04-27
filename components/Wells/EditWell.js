
import React from 'react'
import { connect } from 'react-redux'
import {
    Row,
    Col,
    Button,
} from 'reactstrap'

import {
  fetchWell,
  deleteWell,
  editWell,
  clearEditingWellError,
} from '../../actions/wells'
import WellForm from './WellForm'


class EditWell extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    this.props.fetchWell(this.props.wellId)
  }

  onDelete () {
    this.props.deleteWell(this.props.wellId)
      .then(this.props.onSuccess)
  }

  onSubmit (wellParams) {
    this.props.editWell(this.props.wellId, wellParams)
  }

  render () {
    const well = this.props.wells.get(this.props.wellId)
    if (!well) { return null }

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
          <WellForm
            initialValues={well}
            submitForm={this.onSubmit}
            wellError={this.props.editingWellError}
            clearWellError={this.props.clearEditingWellError}
          />
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (store, props) => ({
    wells: store.get('wells'),
    editingWellError: store.get('editingWellError'),
    editingWell: store.get('editingWell'),
    wellId: parseInt(props.match.params.id, 10),
})

const mapDispatchToProps = dispatch => ({
    fetchWell: id => dispatch(fetchWell(id)),
    deleteWell: id => dispatch(deleteWell(id)),
    editWell: (id, well) => dispatch(editWell(id, well)),
    clearEditingWellError: () => dispatch(clearEditingWellError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditWell)
