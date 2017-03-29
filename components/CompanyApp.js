
import React from 'react'

import PrivateRoute from './Auth'

import CompanyDownloads from './Companies/CompanyDownloads'

const CompanyApp = () => (
    <div>
        <PrivateRoute exact path="/app" component={CompanyDownloads} />
    </div>
)

export default CompanyApp
