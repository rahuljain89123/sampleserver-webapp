
import React from 'react'
import { connect } from 'react-redux'

import {
    Row,
    Col,
} from 'reactstrap'

import {
  createContact,
  clearCreatingContactError,
} from 'actions/contacts'
import { flashMessage, setHeaderInfo } from 'actions/global'


// import NewSiteContactForm from './NewSiteContactForm'
import ContactForm from './ContactForm'

class NewSiteContact extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmitContactForm = this.onSubmitContactForm.bind(this)
  }

  componentDidMount () {

    this.props.setHeaderInfo('New Contact')
  }

  onSubmitContactForm (contactParams) {
    const siteId = this.props.site.get('id')
    contactParams = contactParams.set('site_id', siteId)

    this.props.createContact(contactParams)
      .then((contactId) => {
        this.props.flashMessage('success', 'Contact created successfully')
        this.props.push(`/app/sites/${siteId}/contacts`)
        window.analytics.track('contact created')
      })
      .catch(() => this.props.flashMessage('STANDARD_ERROR'))
  }

  render () {
    const {
      creatingContactError,
      clearCreatingContactError,
    } = this.props

    return (
      <Row className="new-site-contact has-navbar">
        <Col sm={6}>
          <ContactForm
            submitForm={this.onSubmitContactForm}
            formError={creatingContactError}
            clearFormError={clearCreatingContactError}
          />
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (store, props) => ({
  creatingContactError: store.get('creatingContactError'),
})

const mapDispatchToProps = (dispatch) => ({
  flashMessage: (type, message) =>
    dispatch(flashMessage(type, message)),

  createContact: (contactParams) => dispatch(createContact(contactParams)),
  clearCreatingContactError: () => dispatch(clearCreatingContactError()),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewSiteContact)
