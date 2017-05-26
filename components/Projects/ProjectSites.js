
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

import { setHeaderInfo } from 'actions/global'
import { fetchSites } from 'actions/sites'
import { fetchProjects } from 'actions/projects'


class ProjectSites extends React.Component {
  constructor (props) {
    super(props)

    const fetchedSites = props.projects.map(() => true)

    this.state = {
      fetchedSites,
      dropdownOpen: false,
    }
  }

  componentDidMount () {
    this.props.fetchProjects().then(() =>
      this.props.projects.map(project => this.props.fetchSites({ project_id: project.get('id'), per_page: 150 }))
    )
    this.props.setHeaderInfo(
      'Dashboard',
      [{
        text: 'Project',
        onClick: '/app/projects/new',
        iconName: 'add_circle_outline',
      },
      {
        text: 'Site',
        onClick: '/app/sites/new',
        iconName: 'add_circle_outline',
      }],
    )
  }

  componentWillReceiveProps (nextProps) {
    const fetchedSites = nextProps.projects.map(project => {
      if (!this.state.fetchedSites.get(project.get('id'))) {
        this.props.fetchSites({ project_id: project.get('id'), per_page: 150 })
        return true
      }
      return this.state.fetchedSites.get(project.get('id'))
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

  onNewProject () {
    this.props.push('/app/projects/new')
  }

  onNewSite () {
    this.props.push('/app/sites/new')
  }

  onClick (e) {
    e.preventDefault()
    this.props.push(e.target.getAttribute('href'))
  }

  render () {
    const projects = this.props.projects
      .sort((a, b) => a.get('id') - b.get('id'))
      .entrySeq()

    const projectSites = this.props.projects.map(project =>
      this.props.sites
        .filter(site => site.get('project_id') === project.get('id'))
        .sort((a, b) => a.get('id') - b.get('id'))
        .entrySeq())

    return (
      <div className="project-sites">
        <div className="projects">
          {projects.map(([id, project]) => (
            <div className="project" key={id}>
              <div className="project-header d-flex flex-row justify-content-between">
                <div className="project-details">
                  <h5>Project Detail</h5>
                  <h2 className="project-name">{project.get('name')}</h2>
                </div>
                <div className="edit-project">
                  <a href={`/app/projects/${id}`} onClick={e => this.onClick(e)}>
                    <i className="material-icons">settings</i>
                    Edit Project
                  </a>
                </div>
              </div>
              {projectSites.get(id) ? (
                <div className="sites-list">
                  {projectSites.get(id).map(([siteId, site]) => (
                    <div className="site d-flex flex-row justify-content-between" key={siteId}>
                      <div className="site-title">
                        <i className="material-icons">layers</i>
                        <a
                          href={`/app/sites/${siteId}/lab-data-list`}
                          onClick={e => this.onClick(e)}
                        >
                          {site.get('title')}
                        </a>
                      </div>
                      <div className="site-details">
                        <div className="site-metadata">
                          {site.get('city')}, {site.get('state')}
                        </div>
                        <a href={`/app/sites/${siteId}/details/edit-site`}>
                          <i className="material-icons">more_horiz</i></a>
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

const mapStateToProps = store => ({
  projects: store.get('projects'),
  sites: store.get('sites'),
  headerInfo: store.get('headerInfo'),
})

const mapDispatchToProps = dispatch => ({
  fetchProjects: () => dispatch(fetchProjects()),
  fetchSites: filters => dispatch(fetchSites(filters)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSites)
