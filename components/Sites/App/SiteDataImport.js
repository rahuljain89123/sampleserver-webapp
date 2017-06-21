
import React from 'react'
import {
  Switch,
} from 'react-router-dom'
import { connect } from 'react-redux'
import PrivateRoute from 'components/Auth'
import LabDataUpload from 'components/Sites/LabDataUpload'
import FieldDataUpload from 'components/Sites/FieldDataUpload'
import { fetchSite } from 'actions/sites'


class SiteDataImport extends React.Component {
  render () {
    const { site } = this.props
    if (!site) { return null }

    return (
      <div className="data-uploads has-navbar">
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/data-import/field-data`}
          component={props => <FieldDataUpload site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/data-import/lab-data`}
          component={props => <LabDataUpload site={site} {...props} />}
        />
      </div>
    )
  }
}

const mapStateToProps = store => ({
  sites: store.get('sites'),
})

const mapDispatchToProps = dispatch => ({
  fetchSite: id => dispatch(fetchSite(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteDataImport)
