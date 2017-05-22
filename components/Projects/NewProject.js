
import React from 'react'
import {
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap'

import NewProjectForm from './NewProjectForm'
import PageHeader from 'components/PageHeader'

const NewProject = props => (
    <div>
        <PageHeader
          pageTitle={'New Project'}
        />
        <Row>
            <Col sm={6}>
                <NewProjectForm push={props.push} />
            </Col>
        </Row>
    </div>
)

export default NewProject
