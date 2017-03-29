
import React from 'react'
import { Row, Col } from 'reactstrap'
import { NavLink } from 'react-router-dom'

import PrivateRoute from './Auth'

import LabClients from './Companies/LabClients'
import LabClient from './Companies/LabClient'
import NewLabClient from './Companies/NewLabClient'
import ProjectSites from './Projects/ProjectSites'
import TeamLabUsers from './Labs/TeamLabUsers'

const LabApp = () => (
    <Row>
        <Col xs="2">
            <nav className="nav nav-pills flex-column">
                <NavLink
                    to="/app/clients"
                    className="nav-link"
                    activeClassName="active"
                >Clients</NavLink>
                <NavLink
                    to="/app/projects"
                    className="nav-link"
                    activeClassName="active"
                >Projects</NavLink>
                <NavLink
                    to="/app/team"
                    className="nav-link"
                    activeClassName="active"
                >Team</NavLink>
            </nav>
        </Col>
        <Col xs="10">
            <PrivateRoute exact path="/app/clients" component={LabClients} />
            <PrivateRoute path="/app/clients/:id(\\d+)" component={LabClient} />
            <PrivateRoute exact path="/app/clients/new" component={NewLabClient} />
            <PrivateRoute exact path="/app/projects" component={ProjectSites} />
            <PrivateRoute path="/app/team" component={TeamLabUsers} />
        </Col>
    </Row>
)

export default LabApp
