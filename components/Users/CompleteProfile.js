
import React from 'react'

import CompleteProfileForm from './CompleteProfileForm'

const CompleteProfile = props => (
  <div className="row justify-content-center">
    <div className="col-4">
      <div className="standalone-form">
        <h2 className="text-center">Complete Profile</h2>
        <CompleteProfileForm push={props.push} />
      </div>
    </div>
  </div>
)

export default CompleteProfile
