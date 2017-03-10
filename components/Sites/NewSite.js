
import React from 'react'
import {
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap'

import NewSiteForm from './NewSiteForm'

const NewSite = props => (
    <div>
        <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
            <BreadcrumbItem
                tag="a"
                href="/app/sites"
                onClick={e => {
                    e.preventDefault()
                    props.push(e.target.getAttribute('href'))
                }}
            >
                Sites
            </BreadcrumbItem>
            <BreadcrumbItem className="active">
                New Site
            </BreadcrumbItem>
        </Breadcrumb>
        <h4>New Site</h4>
        <Row>
            <Col sm={6}>
                <NewSiteForm push={props.push} />
            </Col>
        </Row>
    </div>
)

export default NewSite
