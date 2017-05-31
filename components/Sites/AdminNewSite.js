
import React from 'react'

import LinkButton from 'SharedComponents/LinkButton'
import Breadcrumbs from '../Breadcrumbs'

import NewSite from './NewSite'

const AdminNewSite = props => (
    <div>
        <Breadcrumbs
            items={[
                { href: '/app/sites', title: 'Sites' },
                { title: 'New Site', active: true },
            ]}
            style={{ marginBottom: 30 }}
        />
        <div className="card">
            <div className="card-block">
                <div className="card-title d-flex flex-row">
                    <h4>New Site</h4>
                    <LinkButton
                        className="ml-auto"
                        href="/app/sites"
                    >Back</LinkButton>
                </div>
                <NewSite onSuccess={id => props.push(`/app/sites/${id}`)} />
            </div>
        </div>
    </div>
)

export default AdminNewSite
