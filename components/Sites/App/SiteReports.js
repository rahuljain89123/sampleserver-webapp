
import React from 'react'
import {
  Switch,
} from 'react-router-dom'
import { connect } from 'react-redux'

import PrivateRoute from 'components/Auth'
import AnalyticalBoxmapsForm from 'Sites/Reports/AnalyticalBoxmaps/AnalyticalBoxmapsForm'
import IsochemicalContours from 'Sites/Reports/IsochemicalContours/IsochemicalContours'
import GroundwaterElevation from 'Sites/Reports/GroundwaterElevation/GroundwaterElevation'

class SiteReports extends React.Component {

  render () {
    const { site } = this.props
    if (!site) { return null }

    return (
      <div>
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/reports/analytical-boxmaps`}
          component={props => <AnalyticalBoxmapsForm site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/reports/isochemical-contours`}
          component={props => <IsochemicalContours site={site} {...props} />}
        />
        <PrivateRoute
          exact
          path={`/app/sites/${site.get('id')}/reports/groundwater-contours`}
          component={props => <GroundwaterElevation site={site} {...props} />}
        />
      </div>
    )
  }
}

export default SiteReports
