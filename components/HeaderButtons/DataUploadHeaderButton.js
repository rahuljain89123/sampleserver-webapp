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
      return this.props.createUpload(Object.assign({}, params, fileParams))
    })
  }

  render () {
    // {button.get('iconName') ? <i className={`material-icons ${button.get('className')}`}>{button.get('iconName')}</i> : ''}

    return (
      <button className="btn btn-default" onClick={() => this.openFilePicker()}>
        New Upload
      </button>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  createUpload: upload => dispatch(createUpload(upload)),
})

export default connect(null, mapDispatchToProps)(DataUploadHeaderButton)


// .catch(e => {
//   e.response.json().then(error => {
//     console.log(error)
//     this.setState({
//       error: error.message
//     })
//   })
// })