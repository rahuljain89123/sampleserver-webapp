
import React from 'react'
import { connect } from 'react-redux'

import { currentLab, currentCompany } from '../../normalizers'
import CompanyUsers from './CompanyUsers'

const TeamCompanyUsers = props => {
    if (!props.lab) {
        return null
    }

    return <CompanyUsers lab={props.lab} currentCompany={props.currentCompany} />
}

const mapStateToProps = store => ({
    lab: currentLab(store),
    currentCompany: currentCompany(store),
})

export default connect(mapStateToProps)(TeamCompanyUsers)
