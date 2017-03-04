
import React from 'react'

import NewUserForm from './NewUserForm'

const NewUser = props => (
    <div>
        <h3>New User</h3>
        <NewUserForm push={props.push} />
    </div>
)

export default NewUser
