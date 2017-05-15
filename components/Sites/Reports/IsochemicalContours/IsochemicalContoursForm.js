import React from 'react'

import { Form } from 'reactstrap'
import {
  Field,
  reduxForm,
} from 'redux-form/immutable'

import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'

class IsochemicalContoursForm extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const siteMapOptions = this.props.siteMaps.valueSeq().map((siteMap) =>
      <option key={siteMap.get('id')} value={siteMap.get('id')}>{siteMap.get('title')}</option>
    )

    const substanceOptions = this.props.substances.valueSeq().map((substance) =>
      <option key={substance.get('id')} value={substance.get('id')}>{substance.get('title')}</option>
    )

    return (<Form>
      <Field
        name='sitemap_id'
        id='sitemap_id'
        component={SelectFormGroup}
        options={siteMapOptions}
      />

      <Field
        name='substance_ids'
        id='substance_ids'
        component={SelectFormGroup}
        options={substanceOptions}
      />
    </Form>)
  }
}

export default reduxForm({ form: 'IsochemicalContoursForm' })(IsochemicalContoursForm)
