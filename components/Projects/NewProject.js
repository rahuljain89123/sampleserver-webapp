
import React from 'react'
import {
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap'

import NewProjectForm from './NewProjectForm'

const NewProject = props => (
    <div>
        <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
            <BreadcrumbItem
                tag="a"
                href="/app/projects"
                onClick={e => {
                    e.preventDefault()
                    props.push(e.target.getAttribute('href'))
                }}
            >
                Projects
            </BreadcrumbItem>
            <BreadcrumbItem className="active">
                New Project
            </BreadcrumbItem>
        </Breadcrumb>
        <h4>New Project</h4>
        <Row>
            <Col sm={6}>
                <NewProjectForm push={props.push} />
            </Col>
        </Row>
    </div>
)

export default NewProject
