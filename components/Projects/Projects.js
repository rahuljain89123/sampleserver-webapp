
import React from 'react'
import { connect } from 'react-redux'
import { Input } from 'reactstrap'

import { fetchProjects } from '../../actions/projects'
import LinkButton from '../LinkButton'
import FilterList from '../FilterList'


class Projects extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            filter: '',
        }
    }

    onChange (e) {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    componentDidMount () {
        this.props.fetchProjects()
    }

    render () {
        const projects = this.props.projects
            .filter(
                project => (
                    project ?
                    project.get('name')
                        .toUpperCase()
                        .indexOf(this.state.filter.toUpperCase()) !== -1
                    : false
                )
            )
            .sort((a, b) => a.get('id') - b.get('id'))
            .entrySeq()

        return (
            <div>
                <div className="d-flex" style={{ marginBottom: 15 }}>
                    <Input
                        value={this.state.filter}
                        name="filter"
                        placeholder="Filter..."
                        onChange={e => this.onChange(e)}
                        style={{ marginRight: 15 }}
                    />
                    <LinkButton
                        color="primary"
                        href="/app/projects/new"
                        className="ml-auto"
                    >New Project</LinkButton>
                </div>
                <FilterList
                    items={projects}
                    title={project => project.get('name') || '-'}
                    href={project => `/app/projects/${project.get('id')}`}
                />
            </div>
        )
    }
}

const mapStateToProps = store => ({
    projects: store.get('projects'),
})

const mapDispatchToProps = dispatch => ({
    fetchProjects: () => dispatch(fetchProjects()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Projects)
