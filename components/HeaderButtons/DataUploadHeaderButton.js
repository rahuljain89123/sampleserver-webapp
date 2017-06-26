import React from 'react'
import { connect } from 'react-redux'

import { createUpload } from 'actions/uploads'

import {
  FILESTACK_API_KEY,
} from 'helpers/filestack'

const FILESTACK_OPTIONS = {
  accept: ['.csv', '.xls'],
  fromSources: ['local_file_system', 'dropbox'],
  storeTo: { location: 's3' },
}

class DataUploadHeaderButton extends React.Component {
  constructor (props) {
    super(props)

    this.client = filestack.init(FILESTACK_API_KEY)
  }

  openFilePicker () {
    this.client
      .pick(FILESTACK_OPTIONS)
      .then(res => this.onUpload(res))
  }

  onUpload (res) {
    res.filesUploaded.map(file => {
      const params = this.props.uploadParams
      const fileParams = { filename: file.filename, url: file.url }
      window.analytics.track('file uploaded', fileParams)
      return this.props.createUpload(Object.assign({}, params, fileParams))
    })
  }

  render () {
    return (
      <button className="btn btn-default" onClick={() => this.openFilePicker()}>
        <i className='material-icons'>add_circle_outline</i>
        New Upload
      </button>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  createUpload: upload => dispatch(createUpload(upload)),
})

export default connect(null, mapDispatchToProps)(DataUploadHeaderButton)
