
import React from 'react'
import { Switch } from 'react-router-dom'

import PrivateRoute from 'components/Auth'

import ClientSites from 'Clients/ClientSites'

import Client from 'Clients/Client'
import NewClient from 'Clients/NewClient'

import NewSite from 'Sites/SiteInfo/NewSite'

import SiteApp from 'Sites/App/SiteApp'
import TeamCompanyUsers from 'Companies/TeamCompanyUsers'

const CompanyApp = () => (
  <div className="company-app container-fluid">
    <PrivateRoute exact path="/app" component={ClientSites} />
    <PrivateRoute path="/app/team" component={TeamCompanyUsers} />
    <Switch>
      <PrivateRoute exact path="/app/sites/new"component={NewSite} />
      <PrivateRoute path="/app/sites/:id" component={SiteApp} />
    </Switch>
    <PrivateRoute path="/app/clients/:id" component={Client} />
    <PrivateRoute exact path="/app/clients/new" component={NewClient} />
  </div>
)

export default CompanyApp
