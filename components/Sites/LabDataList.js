
import React from 'react'
import { connect } from 'react-redux'
import { Button, Table } from 'reactstrap'
import timeago from 'timeago.js'
import { fetchUploads } from 'actions/uploads'
import { setHeaderInfo } from 'actions/global'


class LabDataList extends React.Component {
  componentDidMount () {
    window.analytics.page()
    this.props.fetchUploads({ site_id: this.props.site.get('id') })
    this.props.setHeaderInfo(
      'Lab Data',
    )
  }

  render () {
    const uploads = this.props.uploads
      .filter(upload => upload.get('site_id') === this.props.site.get('id'))
      .filter(upload => upload.get('upload_type') === 'lab_data')
      .filter(upload => upload.get('sent') === true)
      .sort((a, b) => a.get('id') - b.get('id'))
      .entrySeq()

    if (uploads.size > 0) {
      return (
        <div className="lab-data-list has-navbar">
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
    } else {
      return <div className="lab-data-list has-navbar">
        <p>The lab has not yet uploaded any data.</p>
      </div>
    }
  }
}

const mapStateToProps = store => ({
  uploads: store.get('uploads'),
})

const mapDispatchToProps = dispatch => ({
  fetchUploads: filters => dispatch(fetchUploads(filters)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LabDataList)
