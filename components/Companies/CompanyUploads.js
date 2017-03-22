
import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
import ReactFilepicker from 'react-filestack'
import timeago from 'timeago.js'

import { fetchUploads, createUpload } from '../../actions/uploads'


const FILESTACK_OPTIONS = {
    accept: 'image/*',
    fromSources: ['local_file_system', 'dropbox'],
}

class CompanyUploads extends React.Component {
    componentDidMount () {
        this.props.fetchUploads()
    }

    onUpload (obj) {
        const lab = this.props.labs
            .filter(fLab => fLab.get('url') === this.props.currentLabUrl)
            .first()

        obj.filesUploaded.map(file =>
            this.props.createUpload({
                filename: file.name,
                url: file.url,
                lab_id: lab.get('id'),
                company_id: this.props.company.get('id'),
            }))
    }

    render () {
        const uploads = this.props.uploads
            .filter(upload => upload.get('company_id') === this.props.company.get('id'))
            .sort((a, b) => a.get('id') - b.get('id'))
            .entrySeq()

        return (
            <div>
                <div className="d-flex flex-row">
                    <h4>Uploads</h4>
                    <ReactFilepicker
                        apikey={'ATg3pguKNRI2jg6wRHiydz'}
                        buttonText="New Upload"
                        buttonClass="btn btn-secondary ml-auto pointer"
                        options={FILESTACK_OPTIONS}
                        onSuccess={res => this.onUpload(res)}
                    />
                </div>
                <Table size="sm" style={{ marginTop: 30, marginBottom: 60 }}>
                    <thead>
                        <tr>
                            <th>Filename</th>
                            <th>Uploaded</th>
                            <th>Status</th>
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
                                <td>{new timeago().format(new Date(upload.get('created_at')))}</td>
                                <td>{upload.get('sent') ? 'Sent' : 'New'}</td>
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
    labs: store.get('labs'),
    currentLabUrl: store.get('currentLabUrl'),
})

const mapDispatchToProps = dispatch => ({
    fetchUploads: () => dispatch(fetchUploads()),
    createUpload: upload => dispatch(createUpload(upload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyUploads)
