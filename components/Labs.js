
import React from 'react'
import { connect } from 'react-redux'

import { fetchLabs } from '../actions/labs'
import FilterList from './FilterList'
import Pagination from './Pagination'

const PAGE = 1
const PER_PAGE = 10


class Labs extends React.Component {
    componentDidMount () {
        this.props.fetchLabs()
    }

    render () {
        const labs = this.props.labs.slice(((PAGE - 1) * PER_PAGE), PER_PAGE).entrySeq()

        return (
            <div>
                <FilterList
                    items={labs}
                    title={lab => lab.get('title') || '-'}
                    href={lab => `/app/labs/${lab.get('laboratory_id')}`}
                />
                {labs && labs.size === PER_PAGE && <Pagination />}
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
