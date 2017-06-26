import React from 'react'
import { connect } from 'react-redux'

import {
    Button,
    Form,
    FormGroup,
    Label,
    FormText,
    Col,
    Row,
} from 'reactstrap'
import {
  Field,
  reduxForm,
  change,
  formValueSelector,
} from 'redux-form/immutable'

import IndividualFormGroup from 'SharedComponents/ReduxFormHelpers/IndividualFormGroup'

import {
  FILESTACK_API_KEY,
} from 'helpers/filestack'

const FILESTACK_OPTIONS = {
    accept: 'image/*',
    fromSources: ['local_file_system', 'dropbox'],
    maxFiles: 1,
    storeTo: { location: 's3' },
}

export const FORM_NAME = 'sitemapform'

class SiteMapForm extends React.Component {
  constructor (props) {
    super(props)

    this.client = filestack.init(FILESTACK_API_KEY)
    this.pickImage = this.pickImage.bind(this)
    this.setImageParams = this.setImageParams.bind(this)
  }

  pickImage () {
    this.client
      .pick(FILESTACK_OPTIONS)
      .then((res) => this.handleUpload(res))
  }

  setImageParams (image) {
    this.props.dispatch(change(
      FORM_NAME,
      'height',
      image.height
    ))
    this.props.dispatch(change(
      FORM_NAME,
      'width',
      image.width
    ))
  }
  /**
   * When user uploads an image, add the url to the form values
   */
  handleUpload (files) {
    const url = files.filesUploaded[0].url
    this.props.dispatch(change(
      FORM_NAME,
      'url',
      url
    ))
    const setImageParams = this.setImageParams
    let img = new Image()
    img.onload = function () { setImageParams(img) }
    img.src = url;
  }

  render () {
    const {
      handleSubmit,
      url,
      title,
      onSubmit,
      buttonText,
    } = this.props
    const canSubmit = url && title
    let image = null

    if (url) {
      image = <img src={url} height='400' className="img-thumbnail" />
    }

    return (<Form onSubmit={handleSubmit(onSubmit)}>
      <Field
        name='title'
        id='title'
        label='Sitemap Title*'
        component={IndividualFormGroup}
        type='text'
      />
      <div className="preview-image">{image}</div>
      <div className="img-actions row">
        <Label sm={2}>Sitemap Image*</Label>
        <div className="col-sm-9">
          <a onClick={this.pickImage} className="btn btn-default">
            <i className="fa fa-plus-square" aria-hidden="true" /> Choose Image
          </a>
        </div>
      </div>
      <Button
        role="button"
        color="primary"
        disabled={!canSubmit}
      >{buttonText}</Button>
    </Form>)
  }

}

SiteMapForm = reduxForm({ form: FORM_NAME })(SiteMapForm)
const selector = formValueSelector(FORM_NAME)
const mapStateToProps = (state) => ({
  url: selector(state, 'url'),
  title: selector(state, 'title'),
})

export default connect(mapStateToProps)(SiteMapForm)
