
import React from 'react'
import {
  Row,
  Col,
} from 'reactstrap'

import EditSiteForm from './EditSiteForm'

const EditSite = props => (
  <Row>
    <Col sm={6}>
      <EditSiteForm
        site={props.site}
      />
    </Col>
  </Row>
)

export default EditSite
