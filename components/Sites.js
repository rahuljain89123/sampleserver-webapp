
import React from 'react'
import { connect } from 'react-redux'

import { fetchSites } from '../actions/sites'
import FilterList from './FilterList'
import Pagination from './Pagination'

const PAGE = 1
const PER_PAGE = 10


class Sites extends React.Component {
    componentDidMount () {
        this.props.fetchSites()
    }

    render () {
        const sites = this.props.sites.slice(((PAGE - 1) * PER_PAGE), PER_PAGE).entrySeq()

        return (
            <div>
                <FilterList
                    items={sites}
                    title={site => site.get('title') || '-'}
                    href={site => `/app/sites/${site.get('site_id')}`}
                />
                {sites && sites.size === PER_PAGE && <Pagination />}
            </div>
        )
    }
}

const mapStateToProps = store => ({
    sites: store.get('sites').filter(site => site.get('title') !== ''),
})

const mapDispatchToProps = dispatch => ({
    fetchSites: () => dispatch(fetchSites()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sites)
