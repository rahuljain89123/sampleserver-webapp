
import React from 'react'

import PrivateRoute from './Auth'

import ProjectSites from './Projects/ProjectSites'

import Project from './Projects/Project'
import NewProject from './Projects/NewProject'

import NewSite from './Sites/NewSite'

import SiteApp from './SiteApp'

const CompanyApp = () => (
    <div>
        <PrivateRoute exact path="/app" component={ProjectSites} />
        <PrivateRoute path="/app/sites/:id(\\d+)" component={SiteApp} />

        <PrivateRoute path="/app/projects/:id(\\d+)" component={Project} />
        <PrivateRoute exact path="/app/projects/new" component={NewProject} />
        <PrivateRoute
            exact
            path="/app/sites/new"
            component={props => (
                <div>
                    <h4>New Site</h4>
                    <NewSite onSuccess={id => props.push(`/app/sites/${id}`)} />
                </div>
            )}
        />
    </div>
)

export default CompanyApp
