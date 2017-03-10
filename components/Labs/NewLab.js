
import React from 'react'
import {
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap'

import NewLabForm from './NewLabForm'

const NewLab = props => (
    <div>
        <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
            <BreadcrumbItem
                tag="a"
                href="/app/labs"
                onClick={e => {
                    e.preventDefault()
                    props.push(e.target.getAttribute('href'))
                }}
            >
                Labs
            </BreadcrumbItem>
            <BreadcrumbItem className="active">
                New Lab
            </BreadcrumbItem>
        </Breadcrumb>
        <h4>New Lab</h4>
        <Row>
            <Col sm={6}>
                <NewLabForm push={props.push} />
            </Col>
        </Row>
    </div>
)

export default NewLab
