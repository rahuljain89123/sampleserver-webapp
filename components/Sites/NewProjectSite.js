
import React from 'react'
import {
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap'

import NewSiteForm from './NewSiteForm'

const NewProjectSite = props => (
    <div>
        <h4>New Site</h4>
        <Row>
            <Col sm={6}>
                <NewSiteForm push={props.push} />
            </Col>
        </Row>
    </div>
)

export default NewProjectSite
