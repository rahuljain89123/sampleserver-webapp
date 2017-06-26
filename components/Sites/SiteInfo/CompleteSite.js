
import React from 'react'
import { connect } from 'react-redux'

import EditSite from 'Sites/SiteInfo/EditSite'

import { fetchSite } from 'actions/sites'
import { flashMessage } from 'actions/global'


class CompleteSite extends React.Component {
  componentDidMount () {
    this.props.fetchSite(parseInt(this.props.match.params.id))
  }

  render () {
    const site = this.props.sites.get(parseInt(this.props.match.params.id))

    if (!site) { return null }

    // debugger
    return (
      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-6">
          <div className="standalone-form">
            <h2 className="text-center">Site Details</h2>
            <div className="alert alert-warning fade show" role="alert">
              Please fill out site information so we can tailor our reports/tests to this specific site.
            </div>
            <EditSite push={this.props.push} site={site} isCompleteSiteForm={true}/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  sites: store.get('sites')
})

const mapDispatchToProps = dispatch => ({
  fetchSite: id => dispatch(fetchSite(id)),
})
export default connect(mapStateToProps, mapDispatchToProps)(CompleteSite)
