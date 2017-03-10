
import React from 'react'
import {
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap'

import NewCompanyForm from './NewCompanyForm'

const NewCompany = props => (
    <div>
        <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
            <BreadcrumbItem
                tag="a"
                href="/app/companies"
                onClick={e => {
                    e.preventDefault()
                    props.push(e.target.getAttribute('href'))
                }}
            >
                Companies
            </BreadcrumbItem>
            <BreadcrumbItem className="active">
                New Company
            </BreadcrumbItem>
        </Breadcrumb>
        <h4>New Company</h4>
        <Row>
            <Col sm={6}>
                <NewCompanyForm push={props.push} />
            </Col>
        </Row>
    </div>
)

export default NewCompany
