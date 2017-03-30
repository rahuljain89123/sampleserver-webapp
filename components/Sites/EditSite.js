
import React from 'react'
import {
    Row,
    Col,
} from 'reactstrap'

import EditSiteForm from './EditSiteForm'

const EditSite = props => (
    <Row>
        <Col sm={6}>
            <h4 style={{ marginBottom: 20 }}>Site Details</h4>
            <EditSiteForm
                site={props.site}
                onSuccess={props.onSuccess}
            />
        </Col>
    </Row>
)

export default EditSite
