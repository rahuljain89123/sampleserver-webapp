
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import LinkButton from 'components/LinkButton'
import filestack from 'filestack-js'

import {
  fetchSiteMaps,
} from 'actions/siteMaps'
import { setHeaderInfo } from 'actions/global'


class SiteMapsList extends React.Component {

  componentDidMount () {
    this.props.fetchSiteMaps({ site_id: this.props.site.get('id') })
    this.props.setHeaderInfo(
      'Sitemaps',
      [{
        text: 'New Sitemap',
        onClick: `/app/sites/${this.props.site.get('id')}/details/site-maps/new`,
        iconName: 'add_circle_outline',
      }],
    )
  }

  render () {
    let siteMaps = undefined
    let siteMapsTable = undefined

    if (this.props.siteMaps && this.props.siteMaps.size > 0) {
      siteMaps = this.props.siteMaps.valueSeq().map((siteMap) => {
        return (
          <tbody key={siteMap.get('id')}>
            <tr>
              <td>
                <Link
                  to={`/app/sites/${this.props.site.get('id')}/details/site-maps/${siteMap.get('id')}`}>
                  {siteMap.get('title')}
                </Link>
              </td>
              <td>
                <Link
                  to={`/app/sites/${this.props.site.get('id')}/details/site-maps/${siteMap.get('id')}`}>
                  <img src={siteMap.get('url')} height='200' />
                </Link>
              </td>
            </tr>
          </tbody>
        )
      })
      siteMapsTable = (
        <table className="table">
          <thead>
            <tr>
              <th>Sitemap Name</th>
              <th>Preview</th>
            </tr>
          </thead>
          {siteMaps}
        </table>
      )
    } else {
      siteMaps = <p> No Sitemaps found. Add a <Link to={`/app/sites/${this.props.site.get('id')}/details/site-maps/new`}>New Sitemap</Link>.</p>
      siteMapsTable = siteMaps
    }

    return (
      <div className="site-maps">
        <div className="site-map-list">
          {siteMapsTable}
        </div>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  siteMaps: store.get('siteMaps'),
})

const mapDispatchToProps = dispatch => ({
  fetchSiteMaps: filters => dispatch(fetchSiteMaps(filters)),
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteMapsList)
