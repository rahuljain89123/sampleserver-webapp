

import React from 'react'
import { connect } from 'react-redux'
import filestack from 'filestack-js'
import API from 'API'

import {
  FILESTACK_API_KEY,
  resizedImageUrl
} from 'helpers/filestack'

const FILESTACK_OPTIONS = {
    accept: 'image/*',
    fromSources: ['local_file_system', 'dropbox'],
    transformOptions: {
      maxDimensions: [1280, 1280]
    },
    storeTo: { location: 's3' },
}

class WellImages extends React.Component {
  constructor (props) {
    super(props)

    this.pickImage = this.pickImage.bind(this)
    this.client = filestack.init(FILESTACK_API_KEY)
  }

  pickImage () {
    this.client
      .pick(FILESTACK_OPTIONS)
      .then((res) => this.handleUpload(res))
  }

  handleUpload (res) {
    const files = res.filesUploaded.map((file) => ({
      well_id: this.props.wellId,
      url_lg:  file.url,
    }))

    this.props.onUpload(files)
  }

  handleDelete (image, e) {
    e.preventDefault()
    this.props.onDelete(this.props.wellId, image.get('id'))
  }

  resizedImageUrl (imageUrl) {
    return resizedImageUrl(imageUrl, { width: 640, height: 640 })
  }

  render () {
    let wellImages = null
    if (this.props.wellImages && this.props.wellImages.size > 0) {
      wellImages = this.props.wellImages.map((image) => (
        <div key={image.get('id')} className="img">
            <img
              src={this.resizedImageUrl(image.get('url_lg'))}
              className="img-thumbnail" />
            <a
              href='#'
              onClick={(e) => this.handleDelete(image, e)}>
              Delete
            </a>
        </div>
      ))
    } else {
      wellImages = <h4> No images uploaded </h4>
    }

    return (
      <div className="well-images">
        <h3>Images</h3>
        <div className="img-container">
          {wellImages}
        </div>
        <div className="img-actions">
          <button
            onClick={this.pickImage}
            className="btn btn-primary">
            <i className="fa fa-plus-square" aria-hidden="true"></i> Add Image
          </button>
        </div>
      </div>
    )
  }
}

export default  WellImages
