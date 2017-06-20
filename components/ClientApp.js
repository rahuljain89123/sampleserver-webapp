
import React from 'react'

import PrivateRoute from './Auth'

import ClientSites from './Clients/ClientSites'

const ClientApp = () => (
    <div className="client-app">
        <PrivateRoute exact path="/app" component={ClientSites} />
    </div>
)

export default ClientApp
