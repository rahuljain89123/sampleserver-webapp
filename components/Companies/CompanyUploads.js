
import React from 'react'
import { connect } from 'react-redux'
import { Button, Table, Alert } from 'reactstrap'
import filestack from 'filestack-js'
import timeago from 'timeago.js'

import {
  fetchUploads,
  createUpload,
  clearUploadingError,
  patchUpload,
  deleteUpload,
} from 'actions/uploads'

import { setHeaderInfo } from 'actions/global'
import { currentLab } from '../../normalizers'

import {
  FILESTACK_API_KEY,
} from '../../helpers/filestack'

const FILESTACK_OPTIONS = {
  accept: ['.csv', '.xls'],
  fromSources: ['local_file_system', 'dropbox'],
  storeTo: { location: 's3' },
}

class CompanyUploads extends React.Component {
  componentDidMount () {
    if (this.props.uploadingError) { this.props.clearUploadingError() }

    this.props.fetchUploads()

    this.props.setHeaderInfo(
    `${this.props.company.get('title')} / Uploads`,
    [{
      component: 'DataUploadHeaderButton',
      props: {
      uploadParams: {
        lab_id: this.props.lab.get('id'),
        company_id: this.props.company.get('id'),
        upload_type: 'lab_data',
        dry_run: 'true',
        lab_upload: 'true',
      },
      }
    }]
    )
  }

  onSend (upload) {
    this.props.patchUpload(upload.get('id'), { sent: true })
  }

  removeItem (upload) {
    this.props.deleteUpload(upload.get('id'))
  }

  clearError () {
    this.props.clearUploadingError()
  }

  render () {
    const uploads = this.props.uploads
      .filter(upload => upload.get('company_id') === this.props.company.get('id'))
      .filter(upload => upload.get('lab_upload') === true)
      .sort((a, b) => a.get('id') - b.get('id'))
      .entrySeq()

    const uploadTable = (
      <Table size="sm" style={{ marginTop: 30, marginBottom: 60 }}>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Uploaded</th>
            <th>Status</th>
            <th>Action</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map(([id, upload]) => (
            <tr key={id}>
              <td>
                <a href={upload.get('url')} target="_blank" rel="noopener noreferrer">
                  {upload.get('filename')}
                </a>
              </td>
              <td>{timeago().format(new Date(upload.get('created_at')))}</td>
              <td>{upload.get('sent') ? 'Sent' : 'New'}</td>
              <td>
                {upload.get('sent') ? (
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={() => this.onSend(upload)}
                  >Resend</Button>
                ) : (
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.onSend(upload)}
                  >Send</Button>
                )}
              </td>
              <td>
                {!upload.get('sent') ? (
                  <i
                    className="fa fa-times pointer"
                    onClick={() => this.removeItem(upload)}
                  />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )

    let errorMessage = null
    if (this.props.uploadingError) {
      errorMessage = (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <button type="button" className="close" onClick={() => this.clearError()}>
            <span aria-hidden="true">&times;</span>
          </button>
          <strong>Upload Error</strong> {this.props.uploadingError}
        </div>
      )
    }

    let mainContent = null
    if (uploads.size) {
      mainContent = uploadTable
    } else {
      mainContent = (
        <span>Click "New Upload" to upload a data file with client lab results. You'll then get the option to send it to the client.</span>
      )
    }


    return (
      <div className="lab-uploads">
        {errorMessage}
        {mainContent}
      </div>
    )
  }
}

const mapStateToProps = store => ({
  uploads: store.get('uploads'),
  uploadingError: store.get('uploadingError'),
  lab: currentLab(store),
})

const mapDispatchToProps = dispatch => ({
  fetchUploads: () => dispatch(fetchUploads()),
  createUpload: upload => dispatch(createUpload(upload)),
  patchUpload: (id, upload) => dispatch(patchUpload(id, upload)),
  clearUploadingError: () => dispatch(clearUploadingError()),
  deleteUpload: id => dispatch(deleteUpload(id)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyUploads)
