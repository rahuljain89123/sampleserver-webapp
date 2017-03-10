
import React from 'react'
import { connect } from 'react-redux'
import { Input } from 'reactstrap'

import { fetchLabs } from '../../actions/labs'
import LinkButton from '../LinkButton'
import FilterList from '../FilterList'


class Labs extends React.Component {
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
        this.props.fetchLabs()
    }

    render () {
        const labs = this.props.labs.filter(
            lab => lab.get('title').toUpperCase().indexOf(this.state.filter.toUpperCase()) !== -1
        ).entrySeq()

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
                        href="/app/labs/new"
                        className="ml-auto"
                    >New Lab</LinkButton>
                </div>
                <FilterList
                    items={labs}
                    title={lab => lab.get('title') || '-'}
                    href={lab => `/app/labs/${lab.get('laboratory_id')}`}
                />
            </div>
        )
    }
}

const mapStateToProps = store => ({
    labs: store.get('labs').filter(lab => lab.get('title') !== ''),
})

const mapDispatchToProps = dispatch => ({
    fetchLabs: () => dispatch(fetchLabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Labs)
