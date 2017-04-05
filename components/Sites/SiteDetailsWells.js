
import React from 'react'
import { connect } from 'react-redux'
import { Button, Table } from 'reactstrap'
import filestack from 'filestack-js'
import timeago from 'timeago.js'

import {
    fetchUploads,
    createUpload,
    patchUpload,
    deleteUpload,
} from '../../actions/uploads'
import { currentLab } from '../../normalizers'

const FILESTACK_API_KEY = 'ATg3pguKNRI2jg6wRHiydz'
const FILESTACK_OPTIONS = {
    accept: ['.csv', '.xls'],
    fromSources: ['local_file_system', 'dropbox'],
}

class SiteDetailsWells extends React.Component {
    constructor (props) {
        super(props)

        this.client = filestack.init(FILESTACK_API_KEY)
        this.state = {
            sent: false,
        }
    }

    componentDidMount () {
        this.props.fetchUploads()
    }

    onNewUpload () {
        this.client
            .pick(FILESTACK_OPTIONS)
            .then(res => this.onUpload(res))
    }

    onUpload (res) {
        res.filesUploaded.map(file =>
            this.props.createUpload({
                filename: file.filename,
                url: file.url,
                lab_id: this.props.lab.get('id'),
                company_id: this.props.site.get('company_id'),
                project_id: this.props.site.get('project_id'),
                site_id: this.props.site.get('id'),
                upload_type: 'well_data',
            }))
    }

    onSend (upload) {
        this.props.patchUpload(upload.get('id'), { sent: true })
    }

    removeItem (upload) {
        this.props.deleteUpload(upload.get('id'))
    }

    render () {
        const uploads = this.props.uploads
            .filter(upload => upload.get('company_id') === this.props.site.get('company_id'))
            .sort((a, b) => a.get('id') - b.get('id'))
            .entrySeq()

        return (
            <div className="site-details-wells">
                <div className="d-flex flex-row">
                    <h4>Wells</h4>
                    <Button
                        color="secondary"
                        role="button"
                        className="ml-auto"
                        onClick={() => this.onNewUpload()}
                    >Bulk Upload</Button>
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
        )
    }
}

const mapStateToProps = store => ({
    uploads: store.get('uploads'),
    lab: currentLab(store),
})

const mapDispatchToProps = dispatch => ({
    fetchUploads: () => dispatch(fetchUploads()),
    createUpload: upload => dispatch(createUpload(upload)),
    patchUpload: (id, upload) => dispatch(patchUpload(id, upload)),
    deleteUpload: id => dispatch(deleteUpload(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteDetailsWells)
