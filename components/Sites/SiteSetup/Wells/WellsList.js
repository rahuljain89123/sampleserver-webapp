
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Table } from 'reactstrap'
import filestack from 'filestack-js'
import timeago from 'timeago.js'
import {
  fetchUploads,
  createUpload,
  patchUpload,
  deleteUpload,
  clearUploadingError,
} from 'actions/uploads'
import { fetchSite } from 'actions/sites'
import { fetchWells } from 'actions/wells'
import { currentLab, currentCompany } from 'normalizers'
import {
  FILESTACK_API_KEY,
} from 'helpers/filestack'
import { flashMessage, setHeaderInfo } from 'actions/global'
import { compareAlphaNumeric } from 'helpers/util'

const FILESTACK_OPTIONS = {
  accept: ['.csv', '.xls'],
  fromSources: ['local_file_system', 'dropbox'],
  storeTo: { location: 's3' },
}

class WellsList extends React.Component {
  constructor (props) {
    super(props)

    this.client = filestack.init(FILESTACK_API_KEY)
  }

  componentDidMount () {
    window.analytics.page()
    if (this.props.uploadingError) { this.props.clearUploadingError() }

    this.props.fetchUploads()
    this.props.fetchWells({
      site_id: this.props.site.get('id'),
      per_page: 50,
    })
    this.props.setHeaderInfo(
      'Edit Wells',
      [{
        text: 'New Well',
        onClick: `/app/sites/${this.props.site.get('id')}/setup/wells/new`,
        iconName: 'add_circle_outline',
      }],
    )
  }

  onNewUpload () {
    this.client
      .pick(FILESTACK_OPTIONS)
      .then(res => this.onUpload(res))
  }

  onUpload (res) {
    const file = res.filesUploaded[0]
    const wellUpload = {
      filename: file.filename,
      url: file.url,
      lab_id: this.props.lab.get('id'),
      company_id: this.props.company.get('id'),
      client_id: this.props.site.get('client_id'),
      site_id: this.props.site.get('id'),
      upload_type: 'well_data',
    }
    this.props.createUpload(wellUpload).then(() => {
      this.props.fetchWells({
        site_id: this.props.site.get('id'),
        per_page: 100,
      })
      this.props.flashMessage('success', 'Successfully updated wells.')
      window.analytics.track('well bulk upload', wellUpload)
    })
  }

  clearError () {
    this.props.clearUploadingError()
  }

  render () {
    const uploads = this.props.uploads
    .entrySeq()

    const wells = this.props.wells
      .sort((a,b) => compareAlphaNumeric(a.get('title'), b.get('title')))

    let wellsList = null
    let errorDisplay = null

    if (wells.size) {
      wellsList = (
        <table className="table well-list">
          <thead>
            <tr>
              <th>Well Title</th>
              <th>Top of Casing</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {wells.map((well) => (
              <tr key={well.get('id')}>
                <td>
                  <Link to={`/app/sites/${this.props.site.get('id')}/setup/wells/${well.get('id')}`}>
                    {well.get('title')}
                  </Link>
                </td>
                <td>
                  {well.get('top_of_casing').toFixed(2)}
                </td>
                <td className="text-align-right">
                  <Link className="edit-link" to={`/app/sites/${this.props.site.get('id')}/setup/wells/${well.get('id')}`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    } else {
      wellsList = <p>No wells found yet. To add many wells, you can bulk upload.</p>
    }

    if (this.props.uploadingError) {
      errorDisplay = (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <button type="button" className="close" onClick={() => this.clearError()}>
            <span aria-hidden="true">&times;</span>
          </button>
          <strong>Upload Error</strong> {this.props.uploadingError}
        </div>
      )
    }

    return (
      <div className="site-setup-wells has-navbar">
        {errorDisplay}
        <div className="row">
          <div className="col-lg-8 col-md-7 col-sm-6">
            {wellsList}
          </div>
          <div className="col-lg-4 col-md-5 hidden-sm-down">
            <div className="bulk-upload styled-box">
              <div className="header">
                <i className="material-icons">file_upload</i>
                <div className="title">Bulk Upload</div>
              </div>

              <div className="content">
                <Button
                  color="info"
                  role="button"
                  className="ml-auto btn-bulk-upload"
                  onClick={() => this.onNewUpload()}
                >
                  Choose File
                </Button>
                <p>Save time by uploading your well data in a CSV.<br />Need help?</p>
                <a href="/backend/static/sample-uploads/wellinfo_upload_example.csv" className="btn-link">Download a Sample CSV</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (store, ownProps) => ({
  uploads: store.get('uploads'),
  uploadingError: store.get('uploadingError'),
  lab: currentLab(store),
  company: currentCompany(store),
  wells: store.get('wells').filter(well => well.get('site_id') === ownProps.site.get('id')),
})

const mapDispatchToProps = dispatch => ({
  fetchUploads: () => dispatch(fetchUploads()),
  createUpload: upload => dispatch(createUpload(upload)),
  patchUpload: (id, upload) => dispatch(patchUpload(id, upload)),
  clearUploadingError: () => dispatch(clearUploadingError()),
  deleteUpload: id => dispatch(deleteUpload(id)),
  fetchSite: id => dispatch(fetchSite(id)),
  fetchWells: filters => dispatch(fetchWells(filters)),
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(WellsList)
