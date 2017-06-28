
import React from 'react'
import { connect } from 'react-redux'
import { flashMessage, setHeaderInfo } from 'actions/global'
import {
  Row,
  Col,
} from 'reactstrap'

import {
  createSite,
  clearCreatingSiteError,
  setCreatingSite,
} from 'actions/sites'
import { fetchClients } from 'actions/clients'
import SiteForm from 'Sites/SiteInfo/SiteForm'

class NewSite extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmitSiteForm = this.onSubmitSiteForm.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
  }

  componentDidMount () {

    this.props.setHeaderInfo(
      'New Site',
      [{
        text: 'Client',
        onClick: '/app/clients/new',
        iconName: 'add_circle_outline',
      }],
    )
    this.props.fetchClients()
  }

  onSubmitSiteForm (siteParams) {
    siteParams = siteParams.update('state_id', (v) => parseInt(v))
                            .update('client_id', (v) => parseInt(v))

    this.props.createSite(siteParams)
      .then(this.onSuccess)
      .catch(() => this.props.flashMessage('danger', 'Sorry, there was an error.'))
  }

  onSuccess (site) {
    this.props.flashMessage('success', 'Site created successfully')
    this.props.push('/app')
    window.analytics.track('site created', {
      site: site,
    })
  }

  render () {
    const {
      creatingSite,
      creatingSiteError,
      clearCreatingSiteError,
    } = this.props


    return (
      <Row className="has-navbar">
        <Col sm={10}>
          <SiteForm
            clientOptions={this.props.clients}
            siteError={creatingSiteError}
            clearSiteError={clearCreatingSiteError}
            submittingForm={creatingSite}
            submitForm={this.onSubmitSiteForm}
          />
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (state, props) => ({
  creatingSite: state.get('creatingSite'),
  creatingSiteError: state.get('creatingSiteError'),
  clients: state.get('clients'),
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  fetchClients: () => dispatch(fetchClients()),
  createSite: (siteId, siteParams) => dispatch(createSite(siteId, siteParams)),
  setCreatingSite: (editing) => dispatch(setCreatingSite(editing)),
  clearCreatingSiteError: () => dispatch(clearCreatingSiteError()),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewSite)
