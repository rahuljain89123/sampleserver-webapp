
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import {
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap'

import LinkButton from '../LinkButton'
import { fetchProject } from '../../actions/projects'
import EditProjectForm from './EditProjectForm'

const ProjectInfo = props => (
    <div>
        <strong>Name: </strong><span>{props.project.get('name')}</span><br />
    </div>
)

class Project extends React.Component {
    constructor (props) {
        super(props)

        const projectId = parseInt(props.match.params.id, 10)
        const project = props.projects.get(projectId)

        this.state = {
            projectId,
            project,
        }
    }

    componentDidMount () {
        if (!this.state.project) {
            this.props.fetchProject(this.state.projectId)
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            project: nextProps.projects.get(this.state.projectId),
        })
    }

    onClick (e) {
        e.preventDefault()
        this.props.push(e.target.getAttribute('href'))
    }

    render () {
        const project = this.state.project

        if (!project) {
            return null
        }

        return (
            <Switch>
                <Route
                    exact
                    path="/app/projects/:id(\\d+)"
                    render={() => (
                        <div>
                            <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
                                <BreadcrumbItem
                                    tag="a"
                                    href="/app/projects"
                                    onClick={e => this.onClick(e)}
                                >
                                    Projects
                                </BreadcrumbItem>
                                <BreadcrumbItem className="active">
                                    {project.get('name')}
                                </BreadcrumbItem>
                            </Breadcrumb>
                            <div className="card">
                                <div className="card-block">
                                    <div className="card-title d-flex flex-row">
                                        <h4>{project.get('name')}</h4>
                                        <span className="ml-auto">
                                            <LinkButton
                                                color="primary"
                                                href={`/app/projects/${project.get('id')}/edit`}
                                            >Edit Project</LinkButton>
                                        </span>
                                    </div>
                                    <ProjectInfo project={project} />
                                </div>
                            </div>
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/app/projects/:id(\\d+)/edit"
                    render={() => (
                        <div>
                            <Breadcrumb tag="nav" style={{ marginBottom: 30 }}>
                                <BreadcrumbItem
                                    tag="a"
                                    href="/app/projects"
                                    onClick={e => this.onClick(e)}
                                >
                                    Projects
                                </BreadcrumbItem>
                                <BreadcrumbItem
                                    tag="a"
                                    href={`/app/projects/${project.get('id')}`}
                                    onClick={e => this.onClick(e)}
                                >
                                    {project.get('name')}
                                </BreadcrumbItem>
                                <BreadcrumbItem className="active">
                                    Edit Project
                                </BreadcrumbItem>
                            </Breadcrumb>
                            <div className="card">
                                <div className="card-block">
                                    <div className="card-title d-flex flex-row">
                                        <h4>{project.get('name')}</h4>
                                        <LinkButton
                                            href={`/app/projects/${project.get('id')}`}
                                            className="ml-auto"
                                        >Back</LinkButton>
                                    </div>
                                    <Row>
                                        <Col sm={6}>
                                            <EditProjectForm project={project} push={this.props.push} />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </Switch>
        )
    }
}

const mapStateToProps = store => ({
    projects: store.get('projects'),
})

const mapDispatchToProps = dispatch => ({
    fetchProject: id => dispatch(fetchProject(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Project)
