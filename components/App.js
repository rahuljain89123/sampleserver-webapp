
import React from 'react'

import PrivateRoute from './Auth'
import ProjectApp from './ProjectApp'
import LabApp from './LabApp'
import CompanyApp from './CompanyApp'
import AdminApp from './AdminApp'

const App = () => (
    <div>
      <PrivateRoute path="/app" component={AdminApp} authorized={['Admin']} />
      <PrivateRoute path="/app" component={LabApp} authorized={['LabAdmin', 'LabAssociate']} />
      <PrivateRoute path="/app" component={CompanyApp} authorized={['CompanyAdmin', 'CompanyAssociate']} />
      <PrivateRoute path="/app" component={ProjectApp} authorized={['ProjectManager']} />
    </div>
)

export default App
