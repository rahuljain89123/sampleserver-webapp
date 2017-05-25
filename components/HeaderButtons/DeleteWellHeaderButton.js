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

class DeleteWellHeaderButton extends React.Component {
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
    this.props.deleteWell(this.props.wellId)
      .then(() => {
        this.props.flashMessage('success', 'Well deleted')
        this.props.push('/app')
      })
      .catch(() => {
        this.props.flashMessage('STANDARD_ERROR')
      })
  }

  render () {
    return <div>
      <button className="btn btn-default" onClick={() => this.onDelete()}>
        <i className='material-icons warning'>remove_circle_outline</i>
        Delete Well
      </button>
    </div>
  }

}

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  deleteWell: (siteId) => dispatch(deleteWell(siteId)),
})

export default connect(null, mapDispatchToProps)(DeleteSiteHeaderButton)
