
import React from 'react'

import PrivateRoute from 'components/Auth'

import Client from 'Clients/Client'
import ClientSites from 'Clients/ClientSites'
import SiteApp from 'Sites/App/SiteApp'
import NewSite from 'Sites/SiteInfo/NewSite'

const ClientApp = () => (
  <div className="client-app container-fluid">
    <PrivateRoute exact path="/app" component={ClientSites} />
    <Switch>
      <PrivateRoute exact path="/app/sites/new"component={NewSite} />
      <PrivateRoute path="/app/sites/:id" component={SiteApp} />
    </Switch>
    <PrivateRoute path="/app/clients/:id" component={Client} />
  </div>
)

export default ClientApp
