
import React from 'react'

import PrivateRoute from './Auth'

import CompanyDownloads from './Companies/CompanyDownloads'

const LabApp = () => (
    <div>
        <PrivateRoute exact path="/app" component={CompanyDownloads} />
    </div>
)

export default LabApp
