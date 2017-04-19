
import React from 'react'
import {
  Row,
  Col,
} from 'reactstrap'

import EditExecutiveSummaryForm from './EditExecutiveSummaryForm.js'

const EditExecutiveSummary = props => (
  <Row>
    <Col sm={6}>
      <EditExecutiveSummaryForm
        site={props.site}
        onSuccess={props.onSuccess}
      />
    </Col>
  </Row>
)

export default EditExecutiveSummary
