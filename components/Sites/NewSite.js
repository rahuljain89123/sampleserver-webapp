
import React from 'react'
import {
    Row,
    Col,
} from 'reactstrap'

import NewSiteForm from './NewSiteForm'

const NewSite = props => (
    <Row>
        <Col sm={6}>
            <NewSiteForm onSuccess={props.onSuccess} />
        </Col>
    </Row>
)

export default NewSite
