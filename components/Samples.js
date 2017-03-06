
import React from 'react'
import { connect } from 'react-redux'

import { fetchSamples } from '../actions/samples'
import FilterList from './FilterList'


class Samples extends React.Component {
    componentDidMount () {
        this.props.fetchSamples()
    }

    render () {
        const samples = this.props.samples.entrySeq()

        return (
            <div>
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
