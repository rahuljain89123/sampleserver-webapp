
import React from 'react'
import { Row, Col } from 'reactstrap'

import SideMenu from './SideMenu'
import PrivateRoute from './Auth'

import Users from './Users/Users'
import User from './Users/User'

import Labs from './Labs/Labs'
import Lab from './Labs/Lab'
import NewLab from './Labs/NewLab'
import AdminLabUsers from './Labs/AdminLabUsers'

import Companies from './Companies/Companies'
import Company from './Companies/Company'
import NewCompany from './Companies/NewCompany'
import CompanyUsers from './Companies/CompanyUsers'

import Sites from './Sites/Sites'
import AdminSite from './Sites/AdminSite'
import AdminNewSite from './Sites/AdminNewSite'
import SiteUsers from './Sites/SiteUsers'

import Clients from './Clients/Clients'
import Client from './Clients/Client'
import NewClient from './Clients/NewClient'
import ClientUsers from './Clients/ClientUsers'

import Samples from './Samples/Samples'
import Sample from './Samples/Sample'

const AdminApp = () => (
    <Row>
        <Col xs="2">
            <PrivateRoute path="/app" component={SideMenu} />
        </Col>
        <Col xs="10">
            <PrivateRoute exact path="/app/users" component={Users} authorized={['Admin']} />
            <PrivateRoute path="/app/users/:id" component={User} />

            <PrivateRoute exact path="/app/labs" component={Labs} />
            <PrivateRoute path="/app/labs/:id" component={Lab} />
            <PrivateRoute exact path="/app/labs/new" component={NewLab} />
            <PrivateRoute path="/app/labs/:id/users" component={AdminLabUsers} />

            <PrivateRoute exact path="/app/companies" component={Companies} />
            <PrivateRoute path="/app/companies/:id" component={Company} />
            <PrivateRoute exact path="/app/companies/new" component={NewCompany} />
            <PrivateRoute path="/app/companies/:id/users" component={CompanyUsers} />

            <PrivateRoute exact path="/app/clients" component={Clients} />
            <PrivateRoute path="/app/clients/:id" component={Client} />
            <PrivateRoute exact path="/app/clients/new" component={NewClient} />

            <PrivateRoute exact path="/app/sites" component={Sites} />
            <PrivateRoute path="/app/sites/:id" component={AdminSite} />
            <PrivateRoute exact path="/app/sites/new" component={AdminNewSite} />
            <PrivateRoute path="/app/sites/:id/users" component={SiteUsers} />

            <PrivateRoute exact path="/app/samples" component={Samples} />
            <PrivateRoute path="/app/samples/:id" component={Sample} />
        </Col>
    </Row>
)

export default AdminApp
