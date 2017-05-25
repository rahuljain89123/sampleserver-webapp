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
      <button className="btn btn-default" onClick={() => this.onDelete()}>
        <i className='material-icons warning'>remove_circle_outline</i>
        {this.props.buttonText}
      </button>
    </div>
  }

}

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  deleteContact: (id) => dispatch(deleteContact(id)),
  deleteWell: (id) => dispatch(deleteWell(id)),
})

export default connect(null, mapDispatchToProps)(DeleteSiteHeaderButton)
