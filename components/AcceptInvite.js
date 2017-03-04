
import React from 'react'
import qs from 'qs'
import AcceptInviteForm from './AcceptInviteForm'

const AcceptInvite = props => {
    const query = qs.parse(props.location.search.substr(1))

    return (
        <div className="columns">
            <div
                className="one-third column centered border p-3 mb-3"
                style={{ marginTop: 200 }}
            >
                <h2 className="text-center">Accept Invite to SampleServe</h2>
                <AcceptInviteForm code={query.code} push={props.push} />
            </div>
        </div>
    )
}

export default AcceptInvite
