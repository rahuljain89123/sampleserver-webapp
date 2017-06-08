
import React from 'react'
import { Row, Col } from 'reactstrap'
import { NavLink, Switch } from 'react-router-dom'

import PrivateRoute from './Auth'

import LabClients from './Companies/LabClients'
import LabClient from './Companies/LabClient'
import NewLabClient from './Companies/NewLabClient'
import TeamLabUsers from './Labs/TeamLabUsers'

const LabApp = () => (
  <div className="container-fluid">
      <div className="lab-app">
        <PrivateRoute exact path="/app" component={LabClients} />
        <Switch>
          <PrivateRoute exact path="/app/clients/new" component={NewLabClient} />
          <PrivateRoute path="/app/clients/:id" component={LabClient} />
        </Switch>
        <PrivateRoute path="/app/team" component={TeamLabUsers} />
      </div>
  </div>
)

export default LabApp
