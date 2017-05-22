
import React from 'react'

import PrivateRoute from './Auth'

import ProjectSites from './Projects/ProjectSites'

import Project from './Projects/Project'
import NewProject from './Projects/NewProject'

import NewSite from './Sites/NewSite'

import SiteApp from './SiteApp'
import TeamCompanyUsers from './Companies/TeamCompanyUsers'

const CompanyApp = () => (
    <div className="company-app">
        <PrivateRoute exact path="/app" component={ProjectSites} />
        <PrivateRoute path="/app/team" component={TeamCompanyUsers} />

        <PrivateRoute path="/app/sites/:id" component={SiteApp} />

        <PrivateRoute path="/app/projects/:id" component={Project} />
        <PrivateRoute exact path="/app/projects/new" component={NewProject} />
        <PrivateRoute
            exact
            path="/app/sites/new"
            component={props => (
                <div>
                    <h4>New Site</h4>
                    <NewSite push={props.push} />
                </div>
            )}
        />
    </div>
)

export default CompanyApp
