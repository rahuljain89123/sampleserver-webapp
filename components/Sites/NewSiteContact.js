
import React from 'react'
import {
    Row,
    Col,
} from 'reactstrap'

import NewSiteContactForm from './NewSiteContactForm'

const NewSiteContact = props => (
    <Row>
        <Col sm={6}>
            <h4>New Contact</h4>
            <NewSiteContactForm site={props.site} onSuccess={props.onSuccess} />
        </Col>
    </Row>
)

export default NewSiteContact
