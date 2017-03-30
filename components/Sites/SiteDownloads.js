
import React from 'react'
import { connect } from 'react-redux'
import { Button, Table } from 'reactstrap'
import timeago from 'timeago.js'

import { fetchUploads } from '../../actions/uploads'


class SiteDownloads extends React.Component {
    componentDidMount () {
        this.props.fetchUploads({ site_id: this.props.site.get('id') })
    }

    render () {
        const uploads = this.props.uploads
            .filter(upload => upload.get('site_id') === this.props.site.get('id'))
            .sort((a, b) => a.get('id') - b.get('id'))
            .entrySeq()

        return (
            <div>
                <h4>Downloads</h4>
                <Table size="sm" style={{ marginTop: 30, marginBottom: 60 }}>
                    <thead>
                        <tr>
                            <th>Filename</th>
                            <th>Uploaded</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uploads.map(([id, upload]) => (
                            <tr key={id}>
                                <td>{upload.get('filename')}</td>
                                <td>{timeago().format(new Date(upload.get('created_at')))}</td>
                                <td>
                                    <Button
                                        color="secondary"
                                        size="sm"
                                        href={upload.get('url')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Download
                                    </Button>
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
})

const mapDispatchToProps = dispatch => ({
    fetchUploads: filters => dispatch(fetchUploads(filters)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteDownloads)
