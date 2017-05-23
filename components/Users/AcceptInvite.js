
import React from 'react'
import qs from 'qs'
import AcceptInviteForm from './AcceptInviteForm'

const AcceptInvite = props => {
  const query = qs.parse(props.location.search.substr(1))
  console.log(query)
  console.log(props)
  console.log(props.push)

  return (
    <div className="row justify-content-center">
      <div className="col-4">
        <div className="standalone-form">
          <h2 className="text-center">Accept Invite to SampleServe</h2>
          <AcceptInviteForm code={query.code} push={props.push} />
        </div>
      </div>
    </div>
  )
}

export default AcceptInvite
