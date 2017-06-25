
import React from 'react'
import { connect } from 'react-redux'
import {
    Row,
    Col,
    Button,
} from 'reactstrap'

import {
  fetchContact,
  deleteContact,
  editContact,
  clearEditingContactError,
} from 'actions/contacts'
import { flashMessage, setHeaderInfo } from 'actions/global'
import ContactForm from './ContactForm'


class EditSiteContact extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmitContactForm = this.onSubmitContactForm.bind(this)
  }

  componentDidMount () {
    window.analytics.page()
    this.props.fetchContact(this.props.contactId)

    this.props.setHeaderInfo('Edit Contact', [{
      component: 'DeleteHeaderButton',
      props: {
        deleteMethodName: 'deleteContact',
        deleteId: this.props.contactId,
        successMessage: 'Contact deleted',
        redirectPath: `/app/sites/${this.props.site.get('id')}/contacts`,
        buttonText: 'Delete Contact',
      },
    }])
  }

  onSubmitContactForm (contactParams) {
    this.props.editContact(this.props.contactId, contactParams)
      .then(() => {
        this.props.flashMessage('success', 'Contact updated successfully')
        this.props.push(`/app/sites/${this.props.site.get('id')}/contacts`)
        window.analytics.track('contact updated')
      })
      .catch(() => this.props.flashMessage('STANDARD_ERROR'))
  }

  onDelete () {
    this.props.deleteContact(this.props.contactId)
      .then(() => {
        this.props.flashMessage('success', 'Contact deleted successfully')
        this.props.push(`/app/sites/${this.props.site.get('id')}/contacts`)
        window.analytics.track('contact deleted')
      })
  }

  render () {
    const contact = this.props.contacts.get(this.props.contactId)

    if (!contact) { return null }

    return (
      <Row className="has-navbar">
        <Col sm={6}>
          <ContactForm
            site={this.props.site}
            initialValues={contact}
            formError={this.props.editingContactError}
            clearFormError={this.props.clearEditingContactError}
            submitForm={this.onSubmitContactForm}
          />
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (store, props) => ({
    contacts: store.get('contacts'),
    editingContactError: store.get('editingContactError'),
    contactId: parseInt(props.match.params.id, 10),
})

const mapDispatchToProps = dispatch => ({
    fetchContact: id => dispatch(fetchContact(id)),
    editContact: (id, contactParams) => dispatch(editContact(id, contactParams)),
    deleteContact: id => dispatch(deleteContact(id)),
    clearEditingContactError: () => dispatch(clearEditingContactError()),
    flashMessage: (type, message) => dispatch(flashMessage(type, message)),
    setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSiteContact)
