
import React from 'react'
import { connect } from 'react-redux'
import { Button, Table, Alert } from 'reactstrap'
import filestack from 'filestack-js'
import timeago from 'timeago.js'

import {
    fetchUploads,
    createUpload,
    patchUpload,
    deleteUpload,
} from '../../actions/uploads'
import { currentLab } from '../../normalizers'

import {
  FILESTACK_API_KEY,
} from '../../helpers/filestack'

const FILESTACK_OPTIONS = {
    accept: ['.csv', '.xls'],
    fromSources: ['local_file_system', 'dropbox'],
}

class LabDataUpload extends React.Component {
    constructor (props) {
        super(props)

        this.client = filestack.init(FILESTACK_API_KEY)
        this.state = {
            sent: false,
            error: false,
            site: this.props.site,
        }
    }

    componentDidMount () {
        this.props.fetchUploads()
        console.log(this.props.site.toObject())
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
                site_id: this.props.site.get('id'),
                upload_type: 'lab_data',
            }).catch(e => {
                e.response.json().then(error => {
                    console.log(error)
                    this.setState({
                        error: error.message
                    })
                })
            })
        )
    }

    onSend (upload) {
        this.props.patchUpload(upload.get('id'), { sent: true })
    }

    removeItem (upload) {
        this.props.deleteUpload(upload.get('id'))
    }

    clearError () {
        this.setState({
            error: false
        })
    }

    render () {
        const uploads = this.props.uploads
            .filter(upload => upload.get('company_id') === this.props.site.get('company_id'))
            .filter(upload => upload.get('upload_type') === 'lab_data')
            .sort((a, b) => a.get('id') - b.get('id'))
            .entrySeq()

        return (
            <div className="lab-data-upload">
                {this.state.error ? (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <button type="button" className="close" onClick={() => this.clearError()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <strong>Upload Error</strong> {this.state.error}
                    </div>
                ): ''}
                <div className="d-flex flex-row">
                    <h4>Lab Data Upload</h4>
                    <Button
                        color="secondary"
                        role="button"
                        className="ml-auto"
                        onClick={() => this.onNewUpload()}
                    >New Upload</Button>
                </div>
                {uploads.size > 0 ? (
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
                                    <td>{timeago().format(new Date(upload.get('created_at')))}</td>
                                    <td>Imported</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>You haven't uploaded any lab data yet. <a href="https://www.dropbox.com/s/xk1yhih8ma0ao4p/lab_data_upload_example.csv?dl=1">Download Example</a></p>
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(LabDataUpload)
