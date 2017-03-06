
import React from 'react'
import qs from 'qs'
import AcceptInviteForm from './AcceptInviteForm'

const AcceptInvite = props => {
    const query = qs.parse(props.location.search.substr(1))

    return (
        <div className="row justify-content-center" style={{ marginTop: 200 }}>
            <div className="col-4">
                <h2 className="text-center">Accept Invite to SampleServe</h2>
                <AcceptInviteForm code={query.code} push={props.push} />
            </div>
        </div>
    )
}

export default AcceptInvite
