
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
import { flashMessage, setHeaderInfo } from 'actions/global'

import WellForm from './WellForm'

class NewWell extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmitWellForm = this.onSubmitWellForm.bind(this)
  }

  componentDidMount () {
    this.props.setHeaderInfo('New Well')
  }

  onSubmitWellForm (wellParams) {
    const siteId = this.props.site.get('id')
    wellParams = wellParams.set('site_id', siteId)
    if (wellParams.get('top_of_casing')) {
      wellParams = wellParams.update('top_of_casing', toc => parseFloat(toc))
    }

    this.props.createWell(wellParams)
      .then((wellId) => {
        this.props.flashMessage('success', 'Well created successfully')
        this.props.push(`/app/sites/${siteId}/setup/wells`)
      })
      .catch(() => this.props.flashMessage('STANDARD_ERROR'))
  }

  render () {
    const {
      creatingWellError,
      clearCreatingWellError,
    } = this.props

    return (
      <Row className="new-well has-navbar">
        <Col sm={12}>
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
  setHeaderInfo: (text, buttons) => dispatch(setHeaderInfo(text,buttons)),
  flashMessage: (type, message) =>
    dispatch(flashMessage(type, message)),

  clearCreatingWellError: () => dispatch(clearCreatingWellError()),
  createWell: (wellParams) => dispatch(createWell(wellParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewWell)
