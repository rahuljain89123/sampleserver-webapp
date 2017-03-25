
import React from 'react'
import { connect } from 'react-redux'
import { Button, Table } from 'reactstrap'
import ReactFilepicker from 'react-filestack'
import timeago from 'timeago.js'
import * as Io from 'react-icons/lib/io'

import { fetchUploads, createUpload, patchUpload, deleteUpload } from '../../actions/uploads'


const FILESTACK_OPTIONS = {
    accept: ['.csv', '.xls'],
    fromSources: ['local_file_system', 'dropbox'],
}

class CompanyUploads extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            sent: false,
        }
    }

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

    onSend (upload) {
        this.props.patchUpload(upload.get('id'), { sent: true })
    }

    removeItem (upload) {
        this.props.deleteUpload(upload.get('id'))
    }

    render () {
        const uploads = this.props.uploads
            .filter(upload => upload.get('company_id') === this.props.company.get('id'))
            .sort((a, b) => a.get('id') - b.get('id'))
            .entrySeq()

        return (
            <div className="lab-uploads">
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
                            <th>Action</th>
                            <th>&nbsp;</th>
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
                                <td>
                                    {upload.get('sent') ? (
                                        <Button color="secondary" size="sm" onClick={() => this.onSend(upload)}>Resend</Button>
                                    ) : (
                                        <Button color="primary" size="sm" onClick={() => this.onSend(upload)}>Send</Button>
                                    )}
                                </td>
                                <td>
                                    {!upload.get('sent') ? (<Io.IoCloseRound onClick={() => this.removeItem(upload)} style={{ cursor: 'pointer' }} />) : null}
                                </td>
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
    patchUpload: (id, upload) => dispatch(patchUpload(id, upload)),
    deleteUpload: id => dispatch(deleteUpload(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyUploads)
