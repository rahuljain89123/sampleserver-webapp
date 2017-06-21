
import React from 'react'

import PrivateRoute from 'components/Auth'

import ClientSites from 'Clients/ClientSites'
import SiteApp from 'Sites/App/SiteApp'
import NewSite from 'Sites/NewSite'

const ClientApp = () => (
    <div className="client-app container-fluid">
        <PrivateRoute exact path="/app" component={ClientSites} />
        <PrivateRoute path="/app/sites/:id" component={SiteApp} />
        <PrivateRoute exact path="/app/sites/new"component={NewSite} />
    </div>
)

export default ClientApp
