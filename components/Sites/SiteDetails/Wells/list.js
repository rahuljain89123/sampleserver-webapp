
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Table } from 'reactstrap'
import filestack from 'filestack-js'
import timeago from 'timeago.js'

import {
    fetchUploads,
    createUpload,
    patchUpload,
    deleteUpload,
} from '../../../../actions/uploads'
import { fetchSite } from '../../../../actions/sites'
import { fetchWells } from '../../../../actions/wells'
import { currentLab, currentCompany } from '../../../../normalizers'

import {
  FILESTACK_API_KEY,
} from '../../helpers/filestack'

const FILESTACK_OPTIONS = {
    accept: ['.csv', '.xls'],
    fromSources: ['local_file_system', 'dropbox'],
}

class Wells extends React.Component {
    constructor (props) {
        super(props)

        this.client = filestack.init(FILESTACK_API_KEY)
    }

    componentDidMount () {
        this.props.fetchUploads()
        this.props.fetchWells({ site_id: this.props.site.get('id') })
    }

    onNewUpload () {
        this.client
            .pick(FILESTACK_OPTIONS)
            .then(res => this.onUpload(res))
    }

    onUpload (res) {
        const file = res.filesUploaded[0]
        this.props.createUpload({
            filename: file.filename,
            url: file.url,
            lab_id: this.props.lab.get('id'),
            company_id: this.props.company.get('id'),
            project_id: this.props.site.get('project_id'),
            site_id: this.props.site.get('id'),
            upload_type: 'well_data',
        }).then(() => {
            this.props.fetchWells({ site_id: this.props.site.get('id') })
        })
    }

    render () {
        const uploads = this.props.uploads
        .entrySeq()

        return (
            <div className="site-details-wells">
                <div className="d-flex flex-row">
                    <h2>Wells</h2>
                </div>
                <div className="well-list">
                    {this.props.site.get('well_ids').map(wellId => {
                        const well = this.props.wells.get(wellId)
                        return well ? (
                            <div key={well.get('id')}>
                                <Link to={`/app/sites/${this.props.site.get('id')}/details/wells/${well.get('id')}`}>
                                    {well.get('title')}
                                </Link>
                            </div>
                        ) : null
                    })}
                </div>

                <div className="bulk-upload">

                    <div className="row justify-content-between">
                        <div className="col-4">
                            <h4>Bulk Upload</h4>
                        </div>
                        <div className="col-4 right">
                            <Button
                                color="secondary"
                                role="button"
                                className="ml-auto btn-bulk-upload"
                                onClick={() => this.onNewUpload()}
                            >Choose File</Button>
                        </div>
                    </div>
                    <Table size="sm" style={{ marginTop: 30, marginBottom: 60 }}>
                        <thead>
                            <tr>
                                <th>Filename</th>
                                <th>Uploaded</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uploads.map(([id, upload]) => (
                                <tr key={id}>
                                    <td>
                                        <a href={upload.get('url')} target="_blank" rel="noopener noreferrer">
                                            {upload.get('filename')}
                                        </a>
                                    </td>
                                    <td>{timeago().format(new Date(upload.get('created_at')))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    uploads: store.get('uploads'),
    lab: currentLab(store),
    company: currentCompany(store),
    wells: store.get('wells'),
})

const mapDispatchToProps = dispatch => ({
    fetchUploads: () => dispatch(fetchUploads()),
    createUpload: upload => dispatch(createUpload(upload)),
    patchUpload: (id, upload) => dispatch(patchUpload(id, upload)),
    deleteUpload: id => dispatch(deleteUpload(id)),
    fetchSite: id => dispatch(fetchSite(id)),
    fetchWells: filters => dispatch(fetchWells(filters)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Wells)
