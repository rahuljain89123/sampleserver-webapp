
import React from 'react'
import { connect } from 'react-redux'

import { currentLab } from '../../normalizers'
import LabUsers from './LabUsers'

const TeamLabUsers = props => {
    if (!props.lab) {
        return null
    }

    return <LabUsers lab={props.lab} />
}

const mapStateToProps = store => ({
    lab: currentLab(store),
})

export default connect(mapStateToProps)(TeamLabUsers)
