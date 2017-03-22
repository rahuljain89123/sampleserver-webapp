
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
        obj.filesUploaded.map(file => {
            console.log(file)
            this.props.createUpload({
                filename: file.name,
                url: file.url,
            })
        })
    }

    render () {
        const uploads = this.props.uploads
            .sort((a, b) => a.get('id') - b.get('id'))
            .entrySeq()

        return (
            <div>
                <div className="d-flex flex-row">
                    <h4>Uploads</h4>
                    <ReactFilepicker
                        apikey={'ATg3pguKNRI2jg6wRHiydz'}
                        buttonText="New Upload"
                        buttonClass="btn btn-secondary ml-auto"
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
                                <td>{upload.get('filename')}</td>
                                <td>{new timeago().format(new Date(upload.get('created_at')))}</td>
                                <td>New</td>
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
})

const mapDispatchToProps = dispatch => ({
    fetchUploads: () => dispatch(fetchUploads()),
    createUpload: upload => dispatch(createUpload(upload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyUploads)
