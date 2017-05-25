
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
import { fetchProjects } from 'actions/projects'
import SiteForm from './SiteForm'
import {
  currentCompany
} from 'normalizers'

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
        text: 'Project',
        onClick: '/app/projects/new',
        iconName: 'add_circle_outline',
      }],
    )
    this.props.fetchProjects()
  }

  onSubmitSiteForm (siteParams) {
    siteParams = siteParams.update('state_id', (v) => parseInt(v))
                            .update('project_id', (v) => parseInt(v))
                            .set('company_id', this.props.company.get('id'))

    this.props.createSite(siteParams)
      .then(this.onSuccess)
      .catch(() => this.props.flashMessage('danger', 'Sorry, there was an error.'))
  }

  onSuccess () {
    this.props.flashMessage('success', 'Site created successfully')
    this.props.push('/app')
  }

  render () {
    const {
      creatingSite,
      creatingSiteError,
      clearCreatingSiteError,
    } = this.props


    return (
      <Row>
        <Col sm={6}>
          <SiteForm
            projectOptions = {this.props.projects}
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
  company: currentCompany(state),
  creatingSite: state.get('creatingSite'),
  creatingSiteError: state.get('creatingSiteError'),
  projects: state.get('projects'),
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  fetchProjects: () => dispatch(fetchProjects()),
  createSite: (siteId, siteParams) => dispatch(createSite(siteId, siteParams)),
  setCreatingSite: (editing) => dispatch(setCreatingSite(editing)),
  clearCreatingSiteError: () => dispatch(clearCreatingSiteError()),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewSite)
