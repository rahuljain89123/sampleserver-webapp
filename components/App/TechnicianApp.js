
import React from 'react'

import PrivateRoute from 'components/Auth'

import ClientSites from 'Clients/ClientSites'
import SiteApp from 'Sites/App/SiteApp'
import NewSite from 'Sites/SiteInfo/NewSite'

const TechnicianApp = () => (
    <div className="client-app container-fluid">
        <PrivateRoute exact path="/app" component={ClientSites} />
        <PrivateRoute path="/app/sites/:id" component={SiteApp} />
    </div>
)

export default TechnicianApp
