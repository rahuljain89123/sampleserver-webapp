
import React from 'react'

import PrivateRoute from './Auth'

import LabClients from './Companies/LabClients'
import LabClient from './Companies/LabClient'
import NewLabClient from './Companies/NewLabClient'

const LabApp = () => (
    <div>
        <PrivateRoute exact path="/app" component={LabClients} />
        <PrivateRoute path="/app/clients/:id(\\d+)" component={LabClient} />
        <PrivateRoute exact path="/app/clients/new" component={NewLabClient} />
    </div>
)

export default LabApp
