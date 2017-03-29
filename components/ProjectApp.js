
import React from 'react'

import PrivateRoute from './Auth'

import ProjectSites from './Projects/ProjectSites'

const ProjectApp = () => (
    <div className="container">
        <PrivateRoute exact path="/app" component={ProjectSites} />
    </div>
)

export default ProjectApp
