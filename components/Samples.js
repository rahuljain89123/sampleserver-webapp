
import React from 'react'
import { connect } from 'react-redux'

import { fetchSamples } from '../actions/samples'
import FilterList from './FilterList'
import Pagination from './Pagination'

const PAGE = 1
const PER_PAGE = 10


class Samples extends React.Component {
    componentDidMount () {
        this.props.fetchSamples()
    }

    render () {
        const samples = this.props.samples.slice(((PAGE - 1) * PER_PAGE), PER_PAGE).entrySeq()

        return (
            <div>
                <FilterList
                    items={samples}
                    title={sample => sample.get('sample_id') || '-'}
                    href={sample => `/app/samples/${sample.get('sample_id')}`}
                />
                {samples && samples.size === PER_PAGE && <Pagination />}
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
