
import React from 'react'
import { connect } from 'react-redux'
import {
  Link,
} from 'react-router-dom'
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
} from 'reactstrap'
import LinkButton from 'SharedComponents/LinkButton'
import filestack from 'filestack-js'


import {
  fetchSiteMaps,
  deleteSiteMap,
} from 'actions/siteMaps'
import { setHeaderInfo, flashMessage } from 'actions/global'


class SiteMapsList extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      confirmingDelete: null
    }
    this.confirmDelete = this.confirmDelete.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  componentDidMount () {
    this.props.fetchSiteMaps({ site_id: this.props.site.get('id') })
    this.props.setHeaderInfo(
      'Sitemaps',
      [{
        text: 'New Sitemap',
        onClick: `/app/sites/${this.props.site.get('id')}/setup/site-maps/new`,
        iconName: 'add_circle_outline',
      }],
    )
  }

  confirmDelete (siteMapId) {
    this.setState({confirmingDelete: siteMapId })
  }

  hideModal () {
    this.setState({confirmingDelete: null})
  }

  onDelete () {
    this.props.deleteSiteMap(this.state.confirmingDelete)
      .then(() => {
        this.props.flashMessage('success', 'Site deleted successfully')
        this.hideModal()
      })
      .catch(() => this.props.flashMessage('STANDARD_ERROR'))
  }

  deletingSiteMapTitle () {
    if (this.state.confirmingDelete && this.props.siteMaps.get(this.state.confirmingDelete)) {
      return this.props.siteMaps.get(this.state.confirmingDelete).get('title')
    }
  }

  render () {
    let siteMaps=  undefined
    let siteMapsTable = undefined


    if (this.props.siteMaps && this.props.siteMaps.size > 0) {
      siteMaps = this.props.siteMaps.valueSeq().map((siteMap) => {
        const siteMapPath = `/app/sites/${this.props.site.get('id')}/setup/site-maps/${siteMap.get('id')}`
        return (
          <tbody key={siteMap.get('id')}>
            <tr>
              <td>
                <Link
                  to={siteMapPath}>
                  {siteMap.get('title')}
                </Link>
              </td>
              <td>
                <Link
                  to={siteMapPath}>
                  <img src={siteMap.get('url')} height='200' />
                </Link>
              </td>
              <td style={{ verticalAlign: "middle"}}>
                <button className="btn btn-default" onClick={() => this.confirmDelete(siteMap.get('id'))}>
                  <i className='material-icons warning'>remove_circle_outline</i>
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        )
      })


      siteMapsTable = (
        <table className="table">
          <thead>
            <tr>
              <th>Sitemap Name</th>
              <th>Preview</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          {siteMaps}
        </table>
      )

    } else {
      siteMaps = <p> No Sitemaps found. Add a <Link to={`/app/sites/${this.props.site.get('id')}/setup/site-maps/new`}>New Sitemap</Link>.</p>
      siteMapsTable = siteMaps
    }

    return (
      <div className="site-maps">
        <div className="site-map-list">
          {siteMapsTable}
        </div>
        <Modal isOpen={!!this.state.confirmingDelete} toggle={this.hideModal}>
          <ModalHeader toggle={this.hideModal}>Are you sure you want to delete {this.deletingSiteMapTitle()}?</ModalHeader>
          <ModalFooter>
            <Button color='secondary' onClick={this.hideModal}>No</Button>{' '}
            <Button color='danger' onClick={this.onDelete}>Yes</Button>
          </ModalFooter>
        </Modal>
      </div>

    )
  }
}

const mapStateToProps = (store, ownProps) => ({
  siteMaps: store.get('siteMaps').filter(siteMap => siteMap.get('site_id') === ownProps.site.get('id')),
})

const mapDispatchToProps = dispatch => ({
  fetchSiteMaps: filters => dispatch(fetchSiteMaps(filters)),
  deleteSiteMap: id => dispatch(deleteSiteMap(id)),
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteMapsList)
