
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
import Site from './Sites/Site'
import NewSite from './Sites/NewSite'
import SiteUsers from './Sites/SiteUsers'

import Projects from './Projects/Projects'
import Project from './Projects/Project'
import NewProject from './Projects/NewProject'
import ProjectUsers from './Projects/ProjectUsers'

import Samples from './Samples/Samples'
import Sample from './Samples/Sample'

const AdminApp = () => (
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
            <PrivateRoute path="/app/labs/:id(\\d+)/users" component={AdminLabUsers} />

            <PrivateRoute exact path="/app/companies" component={Companies} />
            <PrivateRoute path="/app/companies/:id(\\d+)" component={Company} />
            <PrivateRoute exact path="/app/companies/new" component={NewCompany} />
            <PrivateRoute path="/app/companies/:id(\\d+)/users" component={CompanyUsers} />

            <PrivateRoute exact path="/app/projects" component={Projects} />
            <PrivateRoute path="/app/projects/:id(\\d+)" component={Project} />
            <PrivateRoute exact path="/app/projects/new" component={NewProject} />
            <PrivateRoute path="/app/projects/:id(\\d+)/users" component={ProjectUsers} />

            <PrivateRoute exact path="/app/sites" component={Sites} />
            <PrivateRoute path="/app/sites/:id(\\d+)" component={Site} />
            <PrivateRoute exact path="/app/sites/new" component={NewSite} />
            <PrivateRoute path="/app/sites/:id(\\d+)/users" component={SiteUsers} />

            <PrivateRoute exact path="/app/samples" component={Samples} />
            <PrivateRoute path="/app/samples/:id(\\d+)" component={Sample} />
        </Col>
    </Row>
)

export default AdminApp
