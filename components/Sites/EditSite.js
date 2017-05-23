
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
import { flashMessage, setHeaderInfo } from 'actions/global'

import SiteForm from './SiteForm'

class EditSite extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmitSiteForm = this.onSubmitSiteForm.bind(this)
  }

  componentDidMount () {
    this.props.setHeaderInfo(
      'Edit Site',
      [{
        component: 'DeleteSiteHeaderButton',
        props: { siteId: this.props.site.get('id') },
      }],
    )
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
  clearEditingSiteError: () => dispatch(clearEditingSiteError()),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSite)
