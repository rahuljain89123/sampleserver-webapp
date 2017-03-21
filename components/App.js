
import React from 'react'

import PrivateRoute from './Auth'
import LabApp from './LabApp'
import AdminApp from './AdminApp'

const App = () => (
    <div>
        <PrivateRoute path="/app" component={AdminApp} authorized={['Admin']} />
        <PrivateRoute path="/app" component={LabApp} authorized={['LabAdmin', 'LabAssociate']} />
    </div>
)

export default App
