
import React from 'react'

import CompleteProfileForm from './CompleteProfileForm'

const CompleteProfile = props => {
    return (
        <div className="row justify-content-center" style={{ marginTop: 200 }}>
            <div className="col-4">
                <h2 className="text-center">Complete Profile</h2>
                <CompleteProfileForm />
            </div>
        </div>
    )
}

export default CompleteProfile
