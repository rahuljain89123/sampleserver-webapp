
import React from 'react'
import AcceptInviteForm from './AcceptInviteForm'

const AcceptInvite = props => (
    <div className="columns">
        <div
            className="one-third column centered border p-3 mb-3"
            style={{ marginTop: 200 }}
        >
            <h2 className="text-center">Accept Invite to SampleServe</h2>
            <AcceptInviteForm code={'nathan@nathancahill.com'} push={props.push} />
        </div>
    </div>
)

export default AcceptInvite
