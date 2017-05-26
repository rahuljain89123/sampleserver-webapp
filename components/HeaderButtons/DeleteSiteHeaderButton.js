import React from 'react'
import { connect } from 'react-redux'

import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
} from 'reactstrap'

import { flashMessage } from 'actions/global'
import { deleteSite } from 'actions/sites'

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
    this.props.deleteSite(this.props.siteId)
      .then(() => {
        this.props.flashMessage('success', 'Site deleted')
        this.props.push('/app')
      })
      .catch(() => {
        this.props.flashMessage('STANDARD_ERROR')
      })
  }

  render () {
    return <div>
      <button className="btn btn-default" onClick={() => this.confirmDelete()}>
        <i className='material-icons warning'>remove_circle_outline</i>
        Delete Site
      </button>
      <Modal isOpen={this.state.confirmingDelete} toggle={this.hideModal}>
        <ModalHeader toggle={this.hideModal}>Are you sure you want to delete this site?</ModalHeader>
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
  deleteSite: (siteId) => dispatch(deleteSite(siteId)),
})

export default connect(null, mapDispatchToProps)(DeleteSiteHeaderButton)
