
import React from 'react'
import {
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap'

import NewLabClientForm from './NewLabClientForm'

const NewLabClient = props => (
    <div>
        <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
            <BreadcrumbItem
                tag="a"
                href="/app"
                onClick={e => {
                    e.preventDefault()
                    props.push(e.target.getAttribute('href'))
                }}
            >
                Clients
            </BreadcrumbItem>
            <BreadcrumbItem className="active">
                New Client
            </BreadcrumbItem>
        </Breadcrumb>
        <h4 style={{ marginBottom: 20 }}>New Client</h4>
        <Row>
            <Col sm={6}>
                <NewLabClientForm push={props.push} />
            </Col>
        </Row>
    </div>
)

export default NewLabClient
