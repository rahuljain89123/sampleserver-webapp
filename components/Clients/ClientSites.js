
import React from 'react'
import { connect } from 'react-redux'
import {
  ListGroup,
  ListGroupItem,
  ButtonDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Navbar,
  Nav,
  NavItem,
} from 'reactstrap'

import { setHeaderInfo, flashMessage } from 'actions/global'
import { fetchSites } from 'actions/sites'
import { fetchClients, deleteClient } from 'actions/clients'
import { currentUserRole } from 'normalizers'
import { CLIENT_MANAGER_ROLE_ID } from 'constants/database/RoleIds'

class ClientSites extends React.Component {
  constructor (props) {
    super(props)

    const fetchedSites = props.clients.map(() => true)

    this.state = {
      fetchedSites,
      dropdownOpen: false,
    }
  }

  componentDidMount () {
    window.analytics.page()
    this.props.fetchClients().then(() =>
      this.props.clients.forEach(client => this.props.fetchSites({ client_id: client.get('id'), per_page: 150 }))
    )
    this.props.setHeaderInfo(
      'Dashboard',
      [{
        text: 'Client',
        onClick: '/app/clients/new',
        iconName: 'add_circle_outline',
        minimumUserRole: CLIENT_MANAGER_ROLE_ID,
      },
      {
        text: 'Site',
        onClick: '/app/sites/new',
        iconName: 'add_circle_outline',
        minimumUserRole: CLIENT_MANAGER_ROLE_ID,
      }],
    )
  }

  componentWillReceiveProps (nextProps) {
    const fetchedSites = nextProps.clients.map(client => {
      if (!this.state.fetchedSites.get(client.get('id'))) {
        this.props.fetchSites({ client_id: client.get('id'), per_page: 150 })
        return true
      }
      return this.state.fetchedSites.get(client.get('id'))
    })

    this.setState({
      fetchedSites,
    })
  }

  onToggle () {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    })
  }

  onNewClient () {
    this.props.push('/app/clients/new')
  }

  onNewSite () {
    this.props.push('/app/sites/new')
  }

  onDelete (clientId) {
    this.props.deleteClient(clientId)
      .then(() => this.props.flashMessage('success', 'Client deleted successfully'))
      .catch(() => this.props.flashMessage('STANDARD_ERROR'))
  }

  onClick (e) {
    e.preventDefault()
    this.props.push(e.target.getAttribute('href'))
  }

  render () {
    const clients = this.props.clients
      .sort((a, b) => a.get('id') - b.get('id'))
      .entrySeq()

    const clientSites = this.props.clients.map(client =>
      this.props.sites
        .filter(site => site.get('client_id') === client.get('id'))
        .sort((a, b) => a.get('id') - b.get('id'))
        .entrySeq())

    return (
      <div className="client-sites has-navbar">
        <div className="clients">
          {clients.map(([id, client]) => (
            <div className="client" key={id}>
              <div className="client-header d-flex flex-row justify-content-between">
                <div className="client-details">
                  <h5>Client Detail</h5>
                  <h2 className="client-name">{client.get('name')}</h2>
                </div>

                <div className="edit-client">
                  { clientSites.get(id).size === 0 && <a href='#' onClick={() => this.onDelete(id)}>
                        <i className='material-icons warning'>remove_circle_outline</i>
                        Delete Client
                      </a>
                  }
                  <a href={`/app/clients/${id}`} onClick={e => this.onClick(e)}>
                    <i className="material-icons">settings</i>
                    Edit Client
                  </a>
                </div>
              </div>
              {clientSites.get(id) ? (
                <div className="sites-list">
                  {clientSites.get(id).map(([siteId, site]) => (
                    <div className="site d-flex flex-row justify-content-between" key={siteId}>
                      <div className="site-title">
                        <i className="material-icons">layers</i>
                        <a
                          href={`/app/sites/${siteId}/reports/analytical-boxmaps`}
                          onClick={e => this.onClick(e)}
                        >
                          {site.get('title')}
                        </a>
                      </div>
                      <div className="site-details">
                        <div className="site-metadata">
                          {site.get('city')}, {site.get('state')}
                        </div>
                        <a className="edit-link" href={`/app/sites/${siteId}/setup/edit-site`}>
                          Edit</a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null }
            </div>
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    clients: store.get('clients'),
    sites: store.get('sites'),
    headerInfo: store.get('headerInfo'),
  }
}

const mapDispatchToProps = dispatch => ({
  fetchClients: () => dispatch(fetchClients()),
  deleteClient: (id) => dispatch(deleteClient(id)),
  fetchSites: filters => dispatch(fetchSites(filters)),
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientSites)
