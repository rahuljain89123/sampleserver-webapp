
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
} from 'actions/uploads'
import { fetchSite } from 'actions/sites'
import { fetchWells } from 'actions/wells'
import { currentLab, currentCompany } from 'normalizers'

import {
  FILESTACK_API_KEY,
} from 'helpers/filestack'

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
    this.props.fetchWells({
      site_id: this.props.site.get('id'),
      per_page: 50
    })
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
      this.props.fetchWells({
        site_id: this.props.site.get('id'),
        per_page: 50
      })
    })
  }

  render () {
    const uploads = this.props.uploads
    .entrySeq()

    let wellsList = null

    if (this.props.wells.size) {
      wellsList = (
        <div className="well-list">
          {this.props.wells.map((well) => (
            <div key={well.get('id')}>
              <Link to={`/app/sites/${this.props.site.get('id')}/details/wells/${well.get('id')}`}>
                {well.get('title')}
              </Link>
            </div>
          ))}
        </div>
      )
    } else {
      wellsList = <p>No wells found yet. To add many wells, you can bulk upload.</p>
    }

    return (
      <div className="site-details-wells">
        <div className="d-flex flex-row justify-content-between">
          <h2>Wells</h2>
          <Button
            onClick={() => this.props.push(`/app/sites/${this.props.site.get('id')}/details/wells/new`)}
            className='btn btn-default float-right'>New Well</Button>
        </div>
        {wellsList}
        <div className="bulk-upload">
          <div className="row justify-content-between">
            <div className="col-4">
              <h4>Bulk Upload</h4><a href="https://www.dropbox.com/s/14q3vy9hm94d2af/wellinfo_upload_example.csv?dl=1">Download Example</a>
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
