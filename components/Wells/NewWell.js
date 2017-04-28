
import React from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Button,
} from 'reactstrap'

import {
  createWell,
  clearCreatingWellError,
} from 'actions/wells'

import { flashMessage } from 'actions/global'

import WellForm from './WellForm'

class NewWell extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmitWellForm = this.onSubmitWellForm.bind(this)
  }

  onSubmitWellForm (wellParams) {
    const siteId = this.props.site.get('id')
    wellParams = wellParams.set('site_id', siteId)

    this.props.createWell(wellParams)
      .then((res) => {
        this.props.flashMessage('success', 'Well created successfully', 'create')
        this.props.push(`/app/sites/${siteId}/details/wells/${res}`)
      })
  }

  render () {
    const {
      creatingWellError,
      clearCreatingWellError,
    } = this.props

    return (
      <Row>
        <Col sm={6}>
          <div className="d-flex">
            <h4>Create Well</h4>
          </div>

          <WellForm
            submitForm={this.onSubmitWellForm}
            wellError={creatingWellError}
            clearWellError={clearCreatingWellError}
          />
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (store, props) => ({
  creatingWellError: store.get('creatingWellError'),
})

const mapDispatchToProps = (dispatch) => ({
  flashMessage: (type, message, heading) =>
    dispatch(flashMessage(type, message, heading)),

  createWell: (wellParams) => dispatch(createWell(wellParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewWell)
