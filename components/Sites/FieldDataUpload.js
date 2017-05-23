
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
import { flashMessage, setHeaderInfo } from 'actions/global'
import { currentLab } from 'normalizers'

import {
  FILESTACK_API_KEY,
} from 'helpers/filestack'

const FILESTACK_OPTIONS = {
  accept: ['.csv', '.xls'],
  fromSources: ['local_file_system', 'dropbox'],
  storeTo: { location: 's3' },
}

class FieldDataUpload extends React.Component {
  componentDidMount () {
    this.props.fetchUploads()

    this.props.setHeaderInfo(
      'Field Data Upload',
      [{
        component: 'DataUploadHeaderButton',
        props: {
          labId: this.props.lab.get('id'),
          companyId: this.props.site.get('company_id'),
          siteId: this.props.site.get('id'),
          uploadType: 'field_data',
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
      .filter(upload => upload.get('upload_type') === 'field_data')
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
      uploadsTable = <p>You haven&apos;t uploaded any field data yet. <a href="https://www.dropbox.com/s/6ee1iqfp6dt03zy/field_data_upload_example.csv?dl=1">Download Example</a></p>
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
      <div className="field-data-uploads">
        {errorDisplay}
        <div className="d-flex flex-row">
          <h2>Field Data Upload</h2>

        </div>
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
  patchUpload: (id, upload) => dispatch(patchUpload(id, upload)),
  clearUploadingError: () => dispatch(clearUploadingError()),
  deleteUpload: id => dispatch(deleteUpload(id)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FieldDataUpload)
