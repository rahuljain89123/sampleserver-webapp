
import React from 'react'
import { connect } from 'react-redux'
import { Input } from 'reactstrap'

import { fetchSamples } from '../../actions/samples'
import LinkButton from '../LinkButton'
import FilterList from '../FilterList'


class Samples extends React.Component {
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
        this.props.fetchSamples()
    }

    render () {
        const samples = this.props.samples
            .filter(
                sample => (
                    sample ?
                    sample.get('sample_id')
                          .toString()
                          .toUpperCase()
                          .indexOf(this.state.filter.toUpperCase()) !== -1
                    : false
                )
            )
            .sort((a, b) => a.get('sample_id') - b.get('sample_id'))
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
                        href="/app/samples/new"
                        className="ml-auto"
                    >New Sample</LinkButton>
                </div>
                <FilterList
                    items={samples}
                    title={sample => sample.get('sample_id') || '-'}
                    href={sample => `/app/samples/${sample.get('sample_id')}`}
                />
            </div>
        )
    }
}

const mapStateToProps = store => ({
    samples: store.get('samples').sort((a, b) => b.sample_id - a.sample_id),
})

const mapDispatchToProps = dispatch => ({
    fetchSamples: () => dispatch(fetchSamples()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Samples)
