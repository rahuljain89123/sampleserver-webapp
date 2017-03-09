
import React from 'react'
import { Row, Col } from 'reactstrap'

import SideMenu from './SideMenu'
import PrivateRoute from './Auth'

import User from './User'
import Users from './Users'

import Labs from './Labs'
import Lab from './Lab'
import NewLab from './NewLab'
import LabUsers from './LabUsers'

import Companies from './Companies'
import Company from './Company'
import CompanyUsers from './CompanyUsers'

import Sites from './Sites'
import Site from './Site'

import Samples from './Samples'
import Sample from './Sample'

const App = () => (
    <Row>
        <Col xs="2">
            <PrivateRoute path="/app" component={SideMenu} />
        </Col>
        <Col xs="10">
            <PrivateRoute exact path="/app/users" component={Users} authorized={['Admin']} />
            <PrivateRoute path="/app/users/:id(\\d+)" component={User} />

            <PrivateRoute exact path="/app/labs" component={Labs} />
            <PrivateRoute path="/app/labs/:id(\\d+)" component={Lab} />
            <PrivateRoute exact path="/app/labs/new" component={NewLab} />
            <PrivateRoute path="/app/labs/:id(\\d+)/users" component={LabUsers} />

            <PrivateRoute exact path="/app/companies" component={Companies} />
            <PrivateRoute path="/app/companies/:id(\\d+)" component={Company} />
            <PrivateRoute path="/app/companies/:id(\\d+)/users" component={CompanyUsers} />

            <PrivateRoute exact path="/app/sites" component={Sites} />
            <PrivateRoute path="/app/sites/:id(\\d+)" component={Site} />

            <PrivateRoute exact path="/app/samples" component={Samples} />
            <PrivateRoute path="/app/samples/:id(\\d+)" component={Sample} />
        </Col>
    </Row>
)

export default App
