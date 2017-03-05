
import React from 'react'
import { Row, Col } from 'reactstrap'

import Labs from './Labs'
import Lab from './Lab'
import LabUsers from './LabUsers'
import User from './User'
import Users from './Users'
import NewUser from './NewUser'
import Sites from './Sites'
import Site from './Site'
import Samples from './Samples'
import SideMenu from './SideMenu'
import PrivateRoute from './Auth'

const App = () => (
    <Row>
        <Col xs="2">
            <PrivateRoute path="/app" component={SideMenu} />
        </Col>
        <Col xs="10">
            <PrivateRoute exact path="/app/labs" component={Labs} />
            <PrivateRoute path="/app/labs/:id(\\d+)" component={Lab} />
            <PrivateRoute path="/app/labs/:id(\\d+)/users" component={LabUsers} />
            <PrivateRoute exact path="/app/users" component={Users} authorized={['Admin']} />
            <PrivateRoute exact path="/app/users/new" component={NewUser} />
            <PrivateRoute path="/app/users/:id(\\d+)" component={User} />
            <PrivateRoute exact path="/app/sites" component={Sites} />
            <PrivateRoute path="/app/sites/:id(\\d+)" component={Site} />
            <PrivateRoute exact path="/app/samples" component={Samples} />
        </Col>
    </Row>
)

export default App
