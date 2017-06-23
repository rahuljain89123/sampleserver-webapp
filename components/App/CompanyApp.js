
import React from 'react'

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
    <PrivateRoute path="/app/sites/:id" component={SiteApp} />
    <PrivateRoute path="/app/clients/:id" component={Client} />
    <PrivateRoute exact path="/app/clients/new" component={NewClient} />
    <PrivateRoute exact path="/app/sites/new"component={NewSite} />
  </div>
)

export default CompanyApp
