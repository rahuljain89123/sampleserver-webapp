
import React from 'react'
import { connect } from 'react-redux'
import { Route, NavLink } from 'react-router-dom'
import {
  Row,
  Col,
  Nav,
} from 'reactstrap'

import { fetchProject } from '../../actions/projects'
import EditProjectForm from './EditProjectForm'
import ProjectUsers from './ProjectUsers'
import { setHeaderInfo } from 'actions/global'


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

    this.props.setHeaderInfo(
      'Edit Project'
    )
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
      <div>
        <div>
          <Nav pills style={{ marginTop: 20, marginBottom: 20 }}>
            <NavLink
              exact
              to={`/app/projects/${project.get('id')}`}
              className="nav-link"
              activeClassName="active"
            >Details</NavLink>
            <NavLink
              exact
              to={`/app/projects/${project.get('id')}/users`}
              className="nav-link"
              activeClassName="active"
            >Manage Users</NavLink>
          </Nav>
        </div>
        <Route
          exact
          path="/app/projects/:id"
          render={() => (
            <Row>
              <Col sm={6}>
                <EditProjectForm project={project} push={this.props.push} />
              </Col>
            </Row>
          )}
        />
        <Route
          exact
          path="/app/projects/:id/users"
          component={ProjectUsers}
        />
      </div>
    )
  }
}

const mapStateToProps = store => ({
  projects: store.get('projects'),
})

const mapDispatchToProps = dispatch => ({
  fetchProject: id => dispatch(fetchProject(id)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Project)
