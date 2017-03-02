
import React from 'react'

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
    <div className="columns">
        <div className="one-fifth column">
            <PrivateRoute path="/app" component={SideMenu} />
        </div>
        <div className="four-fifths column">
            <PrivateRoute exact path="/app/labs" component={Labs} />
            <PrivateRoute path="/app/labs/:id(\\d+)" component={Lab} />
            <PrivateRoute path="/app/labs/:id(\\d+)/users" component={LabUsers} />
            <PrivateRoute exact path="/app/users" component={Users} />
            <PrivateRoute exact path="/app/users/new" component={NewUser} />
            <PrivateRoute path="/app/users/:id(\\d+)" component={User} />
            <PrivateRoute exact path="/app/sites" component={Sites} />
            <PrivateRoute path="/app/sites/:id(\\d+)" component={Site} />
            <PrivateRoute exact path="/app/samples" component={Samples} />
        </div>
    </div>
)

export default App
