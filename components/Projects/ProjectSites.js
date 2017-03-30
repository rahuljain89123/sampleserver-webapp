
import React from 'react'
import { connect } from 'react-redux'
import {
    ListGroup,
    ListGroupItem,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap'

import { fetchSites } from '../../actions/sites'
import { fetchProjects } from '../../actions/projects'
import LinkButton from '../LinkButton'


class ProjectSites extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            dropdownOpen: false,
        }
    }

    componentDidMount () {
        this.props.fetchProjects()
        this.props.fetchSites(1)
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
            <div>
                <div className="d-flex flex-row" style={{ marginBottom: 15 }}>
                    <ButtonDropdown
                        className="ml-auto"
                        isOpen={this.state.dropdownOpen}
                        toggle={() => this.onToggle()}
                    >
                        <DropdownToggle>
                            <i className="fa fa-plus" />
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem className="pointer" onClick={() => this.onNewProject()}>
                                New Project
                            </DropdownItem>
                            <DropdownItem className="pointer" onClick={() => this.onNewSite()}>
                                New Site
                            </DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>
                </div>
                {projects.map(([id, project]) => (
                    <div style={{ marginBottom: 40 }} key={id}>
                        <div className="d-flex flex-row" style={{ marginBottom: 15 }}>
                            <h4>{project.get('name')}</h4>
                            <LinkButton
                                color="link"
                                href={`/app/projects/${id}`}
                            >Edit</LinkButton>
                        </div>
                        {projectSites.get(id) ? (
                            <ListGroup>
                                {projectSites.get(id).map(([siteId, site]) => (
                                    <ListGroupItem key={siteId}>
                                        <a
                                            href={`/app/sites/${siteId}`}
                                            onClick={e => this.onClick(e)}
                                        >
                                            {site.get('title')}
                                        </a>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        ) : null }
                    </div>
                ))}
            </div>
        )
    }
}

const mapStateToProps = store => ({
    projects: store.get('projects'),
    sites: store.get('sites'),
})

const mapDispatchToProps = dispatch => ({
    fetchProjects: () => dispatch(fetchProjects()),
    fetchSites: projectId => dispatch(fetchSites({ project_id: projectId })),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSites)
