
import React from 'react'
import { Row, Col } from 'reactstrap'
import { NavLink } from 'react-router-dom'

import PrivateRoute from './Auth'

import LabClients from './Companies/LabClients'
import LabClient from './Companies/LabClient'
import NewLabClient from './Companies/NewLabClient'
import TeamLabUsers from './Labs/TeamLabUsers'

const LabApp = () => (
    <div>
        <PrivateRoute exact path="/app" component={LabClients} />
        <PrivateRoute path="/app/clients/:id(\\d+)" component={LabClient} />
        <PrivateRoute exact path="/app/clients/new" component={NewLabClient} />
        <PrivateRoute path="/app/team" component={TeamLabUsers} />
    </div>
)

export default LabApp
