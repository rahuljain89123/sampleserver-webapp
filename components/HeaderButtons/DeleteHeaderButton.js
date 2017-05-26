import React from 'react'
import { connect } from 'react-redux'

import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
} from 'reactstrap'

import { flashMessage } from 'actions/global'
import { deleteWell } from 'actions/wells'
import { deleteContact } from 'actions/contacts'

class DeleteSiteHeaderButton extends React.Component {
  constructor (props) {
    super(props)

    this.onDelete = this.onDelete.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.state = { confirmingDelete: false }
  }

  confirmDelete () {
    this.setState({ confirmingDelete: true })
  }

  hideModal () {
    this.setState( { confirmingDelete: false })
  }

  onDelete () {
    this.props[this.props.deleteMethodName](this.props.deleteId)
      .then(() => {
        this.props.flashMessage('success', this.props.successMessage)
        this.props.push(this.props.redirectPath)
      })
      .catch(() => {
        this.props.flashMessage('STANDARD_ERROR')
      })
  }

  render () {
    return <div>
      <button className="btn btn-default" onClick={() => this.confirmDelete()}>
        <i className='material-icons warning'>remove_circle_outline</i>
        {this.props.buttonText}
      </button>
      <Modal isOpen={this.state.confirmingDelete} toggle={this.hideModal}>
        <ModalHeader toggle={this.hideModal}>Are you sure you want to delete?</ModalHeader>
        <ModalFooter>
          <Button color='secondary' onClick={this.hideModal}>No</Button>{' '}
          <Button color='danger' onClick={this.onDelete}>Yes</Button>
        </ModalFooter>
      </Modal>
    </div>
  }

}

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  deleteContact: (id) => dispatch(deleteContact(id)),
  deleteWell: (id) => dispatch(deleteWell(id)),
})

export default connect(null, mapDispatchToProps)(DeleteSiteHeaderButton)
