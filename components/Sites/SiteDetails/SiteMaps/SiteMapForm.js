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
  createSiteMap,
} from 'actions/siteMaps'


import {
  FILESTACK_API_KEY,
} from 'helpers/filestack'

const FILESTACK_OPTIONS = {
    accept: 'image/*',
    fromSources: ['local_file_system', 'dropbox'],
    maxFiles: 1,
}

const FORM_NAME = 'sitemapform'

class SiteMapForm extends React.Component {
  constructor (props) {
    super(props)

    this.client = filestack.init(FILESTACK_API_KEY)
    this.createSiteMap = this.createSiteMap.bind(this)
    this.pickImage = this.pickImage.bind(this)
  }

  pickImage () {
    this.client
      .pick(FILESTACK_OPTIONS)
      .then((res) => this.handleUpload(res))
  }

  handleUpload (files) {
    const url = files.filesUploaded[0].url
    this.props.dispatch(change(
      FORM_NAME,
      'url',
      url
    ))
  }

  createSiteMap (siteMapParams) {
    siteMapParams = siteMapParams.set('site_id', this.props.site.get('id'))

    this.props.createSiteMap(siteMapParams).then((siteMapId) => {
      this.props.push(`/app/sites/${this.props.site.get('id')}/details/site-maps/${siteMapId}`)
    })
  }

  render () {
    const { handleSubmit, url, title } = this.props
    const canSubmit = url && title
    let image = null
    if (url) {
      image = <img src={url} height='400'  />
    }

    return (<Form onSubmit={handleSubmit(this.createSiteMap)}>
      <Field
        name='title'
        id='title'
        label='Site Map Title'
        component={IndividualFormGroup}
        type='text'
      />
      {image}
      <div className="img-actions">
        <a
          href='#'
          onClick={this.pickImage}
          className="btn btn-primary">
          <i className="fa fa-plus-square" aria-hidden="true"></i> Add Image
        </a>
      </div>
      <Button
          role="button"
          color="primary"
          disabled={!canSubmit}
      >Create</Button>
    </Form>)
  }

}

SiteMapForm = reduxForm({ form: FORM_NAME })(SiteMapForm)
const selector = formValueSelector(FORM_NAME)
const mapStateToProps = (state) => ({
  url: selector(state, 'url'),
  title: selector(state, 'title'),
})

const mapDispatchToProps = dispatch => ({
  createSiteMap: siteMapParams => dispatch(createSiteMap(siteMapParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteMapForm)
