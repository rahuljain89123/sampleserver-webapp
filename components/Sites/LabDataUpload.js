
import React from 'react'
import { connect } from 'react-redux'
import { Button, Table, Alert } from 'reactstrap'
import filestack from 'filestack-js'
import timeago from 'timeago.js'

import {
  fetchUploads,
  patchUpload,
  deleteUpload,
  clearUploadingError,
} from 'actions/uploads'
import { setHeaderInfo } from 'actions/global'

import { currentLab } from 'normalizers'

class LabDataUpload extends React.Component {


  componentDidMount () {
    if (this.props.uploadingError) { this.props.clearUploadingError() }
    this.props.fetchUploads()

    this.props.setHeaderInfo(
      'Lab Data Upload',
      [{
        component: 'DataUploadHeaderButton',
        props: {
          uploadParams: {
            lab_id: this.props.lab.get('id'),
            company_id: this.props.site.get('company_id'),
            site_id: this.props.site.get('id'),
            upload_type: 'lab_data',
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
      .filter(upload => upload.get('company_id') === this.props.site.get('company_id'))
      .filter(upload => upload.get('site_id') === this.props.site.get('id'))
      .filter(upload => upload.get('upload_type') === 'lab_data')
      .sort((a, b) => a.get('id') - b.get('id'))
      .entrySeq()

    let uploadsTable = null
    let errorDisplay = null

    if (uploads.size) {
      uploadsTable = (
        <Table size="sm" style={{ marginTop: 30, marginBottom: 60 }}>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Uploaded</th>
              <th>Status</th>
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
                <td>Imported</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )
    } else {
      uploadsTable = <p>You haven&apos;t uploaded any lab data yet. <a href="/backend/static/sample-uploads/lab_data_upload_example.csv">Download Example</a></p>
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
      <div className="lab-data-uploads">
        {errorDisplay}

        {uploadsTable}
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

export default connect(mapStateToProps, mapDispatchToProps)(LabDataUpload)
