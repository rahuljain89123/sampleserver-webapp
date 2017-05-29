
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
import { setHeaderInfo } from 'actions/global'

const FILESTACK_OPTIONS = {
  accept: ['.csv', '.xls'],
  fromSources: ['local_file_system', 'dropbox'],
  storeTo: { location: 's3' },
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
      per_page: 50,
    })
    this.props.setHeaderInfo(
      'Edit Wells',
      [{
        text: 'New Well',
        onClick: `/app/sites/${this.props.site.get('id')}/details/wells/new`,
        iconName: 'add_circle_outline',
      }],
    )
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
        <table className="table well-list">
          <thead>
            <tr>
              <th>Well Title</th>
              <th className="hidden-lg-down">Est. Depth to Water</th>
              <th className="hidden-lg-down">Depth to Bottom</th>
              <th className="hidden-lg-down">Screen Length</th>
              <th>Top of Casing</th>
            </tr>
          </thead>
          <tbody>
            {this.props.wells.map((well) => (
              <tr key={well.get('id')}>
                <td>
                  <Link to={`/app/sites/${this.props.site.get('id')}/details/wells/${well.get('id')}`}>
                    {well.get('title')}
                  </Link>
                </td>
                <td className="hidden-lg-down">
                  {well.get('est_depth_to_water')}
                </td>
                <td className="hidden-lg-down">
                  {well.get('depth_to_bottom')}
                </td>
                <td className="hidden-lg-down">
                  {well.get('screenlength')}
                </td>
                <td>
                  {well.get('top_of_casing')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    } else {
      wellsList = <p>No wells found yet. To add many wells, you can bulk upload.</p>
    }

    return (
      <div className="site-details-wells">
        <div className="row">
          <div className="col-lg-8 col-md-7 col-sm-6">
            {wellsList}
          </div>
          <div className="col-lg-4 col-md-5 hidden-sm-down">
            <div className="bulk-upload styled-box">
              <div className="header">
                <i className="material-icons">file_upload</i>
                <div className="title">Bulk Upload</div>
              </div>

              <div className="content">
                <Button
                  color="primary"
                  role="button"
                  className="ml-auto btn-bulk-upload btn-lg"
                  onClick={() => this.onNewUpload()}
                >
                  Choose File
                </Button>
                <p>Save time by uploading your well data in a CSV.<br />Need help?</p>
                <a href="https://www.dropbox.com/s/14q3vy9hm94d2af/wellinfo_upload_example.csv?dl=1">Download a Sample CSV</a>
              </div>
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
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Wells)
