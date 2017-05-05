import React from 'react'
import { connect } from 'react-redux'

import {
    Button,
    Form,
} from 'reactstrap'
import {
  Field,
  reduxForm,
  change,
  formValueSelector,
} from 'redux-form/immutable'

import IndividualFormGroup from 'components/shared/ReduxFormHelpers/IndividualFormGroup'

import {
  FILESTACK_API_KEY,
} from 'helpers/filestack'

const FILESTACK_OPTIONS = {
    accept: 'image/*',
    fromSources: ['local_file_system', 'dropbox'],
    maxFiles: 1,
}

export const FORM_NAME = 'sitemapform'

class SiteMapForm extends React.Component {
  constructor (props) {
    super(props)

    this.client = filestack.init(FILESTACK_API_KEY)
    this.pickImage = this.pickImage.bind(this)
  }

  pickImage () {
    this.client
      .pick(FILESTACK_OPTIONS)
      .then((res) => this.handleUpload(res))
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
      image = <img src={url} height='400'  />
    }

    return (<Form onSubmit={handleSubmit(onSubmit)}>
      <Field
        name='title'
        id='title'
        label='Site Map Title'
        component={IndividualFormGroup}
        type='text'
      />
      {image}
      <div className="img-actions" style={{margin: '20px'}}>
        <a
          href='#'
          onClick={this.pickImage}
          className="btn btn-primary">
          <i className="fa fa-plus-square" aria-hidden="true"></i> Upload SiteMap
        </a>
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
