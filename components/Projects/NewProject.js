
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
        <h4>New Project</h4>
        <Row>
            <Col sm={6}>
                <NewProjectForm push={props.push} />
            </Col>
        </Row>
    </div>
)

export default NewProject
