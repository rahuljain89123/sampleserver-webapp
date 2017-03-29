
import React from 'react'
import { connect } from 'react-redux'
import {
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap'

import LabUsers from './LabUsers'

const AdminLabUsers = props => {
    const labId = parseInt(props.match.params.id, 10)
    const lab = props.labs.get(labId)

    if (!lab) {
        return null
    }

    return (
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
                <BreadcrumbItem
                    tag="a"
                    href={`/app/labs/${lab.get('id')}`}
                    onClick={e => {
                        e.preventDefault()
                        props.push(e.target.getAttribute('href'))
                    }}
                >
                    {lab.get('title')}
                </BreadcrumbItem>
                <BreadcrumbItem className="active">
                    Manage Users
                </BreadcrumbItem>
            </Breadcrumb>
            <LabUsers lab={lab} />
        </div>
    )
}

const mapStateToProps = store => ({
    labs: store.get('labs'),
})

export default connect(mapStateToProps)(AdminLabUsers)
