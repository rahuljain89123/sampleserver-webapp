
import React from 'react'
import { connect } from 'react-redux'
import {
    Row,
    Col,
    Button,
} from 'reactstrap'

import {
  fetchWell,
  deleteWell,
  editWell,
  clearEditingWellError,
} from 'actions/wells'

import {
  fetchWellImages,
  uploadWellImages,
  deleteWellImage,
} from 'actions/wellImages'

import { flashMessage, setHeaderInfo } from 'actions/global'

import WellForm from './WellForm'
import WellImages from './WellImages'

class EditWell extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmitWellForm = this.onSubmitWellForm.bind(this)
    this.onUploadWellImages = this.onUploadWellImages.bind(this)
    this.onDeleteWellImage = this.onDeleteWellImage.bind(this)
  }

  componentDidMount () {
    this.props.fetchWell(this.props.wellId)
    this.props.fetchWellImages(this.props.wellId)

    this.props.setHeaderInfo('Edit Well', [{
      component: 'DeleteHeaderButton',
      props: {
        deleteMethodName: 'deleteWell',
        deleteId: this.props.wellId,
        successMessage: 'Well deleted',
        redirectPath: `/app/sites/${this.props.site.get('id')}/details/wells`,
        buttonText: 'Delete Well'
      }
    }])
  }

  onSubmitWellForm (wellParams) {
    this.props.editWell(this.props.wellId, wellParams)
      .then(() => {
        this.props.flashMessage('success', 'Well Updated Successfully')
        this.props.push(`/app/sites/${this.props.site.get('id')}/details/wells`)
      })
      .catch(() => this.props.flashMessage('STANDARD_ERROR'))
  }

  onUploadWellImages (wellImages) {
    this.props.uploadWellImages(this.props.wellId, wellImages)
      .then(this.props.fetchWellImages(this.props.wellId))
      .then(
        this.props.flashMessage(
          'success',
          'Well Image Uploaded Successfully',
        )
      )
  }

  onDeleteWellImage (wellId, wellImageId) {
    this.props.deleteWellImage(wellId, wellImageId)
      .then(
        this.props.flashMessage(
          'success',
          'Well Image Deleted Successfully',
        )
      )
  }

  render () {

    const {
      wellId,
      editingWellError,
      clearEditingWellError,
    } = this.props

    const well = this.props.wells.get(wellId)
    const wellImages = this.props.wellImages.get(wellId)
    if (!well) { return null }

    return (
      <Row>
        <Col sm={6}>

          <WellForm
            initialValues={well}
            submitForm={this.onSubmitWellForm}
            wellError={editingWellError}
            clearWellError={clearEditingWellError}
          />
          <hr/>

          <WellImages
            wellId={wellId}
            wellImages={wellImages}
            onUpload={this.onUploadWellImages}
            onDelete={this.onDeleteWellImage}
           />
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (store, props) => ({
  wells: store.get('wells'),
  wellImages: store.get('wellImages'),
  editingWellError: store.get('editingWellError'),
  editingWell: store.get('editingWell'),
  wellId: parseInt(props.match.params.id, 10),
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) =>
    dispatch(flashMessage(type, message)),

  /* Well Dispatches */
  fetchWell: id => dispatch(fetchWell(id)),
  deleteWell: id => dispatch(deleteWell(id)),
  editWell: (id, well) => dispatch(editWell(id, well)),
  clearEditingWellError: () => dispatch(clearEditingWellError()),

  /* Well Image Dispatches */
  fetchWellImages: wellId => dispatch(fetchWellImages(wellId)),
  uploadWellImages: (wellId, wellImageParams) =>
    dispatch(uploadWellImages(wellId, wellImageParams)),
  deleteWellImage: (wellId, wellImageId) =>
    dispatch(deleteWellImage(wellId, wellImageId)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})
// <div className="d-flex">
//   <Button
//     onClick={() => this.onDelete()}
//     className="ml-auto"
//     role="button"
//     color="danger"
//   >Delete Well</Button>
// </div>

export default connect(mapStateToProps, mapDispatchToProps)(EditWell)
