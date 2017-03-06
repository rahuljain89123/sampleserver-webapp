
import React from 'react'
import { Row, Col } from 'reactstrap'

import NewUserForm from './NewUserForm'

const NewUser = props => (
    <div>
        <h3>New User</h3>
        <Row>
            <Col sm={6}>
                <NewUserForm push={props.push} />
            </Col>
        </Row>
    </div>
)

export default NewUser
