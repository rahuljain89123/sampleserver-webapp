
import React from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
} from 'reactstrap'

import {
  editSite,
  deleteSite,
  clearEditingSiteError,
  setEditingSite,
} from 'actions/sites'
import { flashMessage } from 'actions/global'

import SiteForm from './SiteForm'

class EditSite extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmitSiteForm = this.onSubmitSiteForm.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.state = {
      confirmingDelete: false,
    }
  }

  confirmDelete () {
    this.setState({ confirmingDelete: true })
  }

  onDelete () {
    this.props.deleteSite(this.props.site.get('id'))
      .then(() => {
        this.props.flashMessage('success', 'Site deleted')
        this.props.push('/app')
      })
      .catch(() => {
        this.props.flashMessage('STANDARD_ERROR')
      })
  }

  hideModal () {
    this.setState( { confirmingDelete: false })
  }

  onSubmitSiteForm (siteParams) {
    siteParams = siteParams.update('state_id', (v) => parseInt(v))

    this.props.editSite(this.props.site.get('id'), siteParams)
      .then(() => this.props.flashMessage('success', 'Site updated successfully'))
      .catch(() => this.props.flashMessage('danger', 'Sorry, there was an error.'))
  }

  render () {
    const {
      site,
      editingSite,
      editingSiteError,
      clearEditingSiteError,
    } = this.props

    if (!site) { return null }

    return (
      <div>
        <div className="border-bottom">
          <h2>Site Details</h2>
          <Button
            onClick={() => this.confirmDelete()}
            className="ml-auto"
            role="button"
            color="danger"
          >Delete Site</Button>
        </div>
        <Row>
          <Col sm={6}>
            <SiteForm
              initialValues={site}
              siteError={editingSiteError}
              clearSiteError={clearEditingSiteError}
              submittingForm={editingSite}
              submitForm={this.onSubmitSiteForm}
            />
          </Col>
        </Row>
        <Modal isOpen={this.state.confirmingDelete} toggle={this.hideModal}>
          <ModalHeader toggle={this.hideModal}>Are you sure you want to delete this site?</ModalHeader>
          <ModalFooter>
            <Button color='secondary' onClick={this.hideModal}>No</Button>{' '}
            <Button color='danger' onClick={this.onDelete}>Yes</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }

}

const mapStateToProps = (state, props) => ({
  editingSite: state.get('editingSite'),
  editingSiteError: state.get('editingSiteError'),
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),

  editSite: (siteId, siteParams) => dispatch(editSite(siteId, siteParams)),
  setEditingSite: (editing) => dispatch(setEditingSite(editing)),
  deleteSite: (siteId) => dispatch(deleteSite(siteId)),
  clearEditingSiteError: () => dispatch(clearEditingSiteError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSite)
