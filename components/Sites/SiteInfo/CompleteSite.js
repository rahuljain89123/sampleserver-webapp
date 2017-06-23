
import React from 'react'
import { connect } from 'react-redux'

import EditSite from 'Sites/EditSite'

import { fetchSite } from 'actions/sites'
import { flashMessage } from 'actions/global'


class CompleteSite extends React.Component {
  componentDidMount () {
    this.props.fetchSite(parseInt(this.props.match.params.id))
  }

  render () {
    const site = this.props.sites.get(parseInt(this.props.match.params.id))

    if (!site) { return null }

    return (
      <div className="row justify-content-center">
        <div className="col-4">
          <div className="standalone-form">
            <h2 className="text-center">Edit Site</h2>
            <EditSite push={this.props.push} site={site} removeNavbarPadding={true}/>
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
