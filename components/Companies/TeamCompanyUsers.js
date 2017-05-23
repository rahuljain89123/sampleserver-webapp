
import React from 'react'
import { connect } from 'react-redux'
import { currentLab, currentCompany } from '../../normalizers'
import CompanyUsers from './CompanyUsers'
import { setHeaderInfo } from 'actions/global'


class TeamCompanyUsers extends React.Component {
  componentDidMount () {
    this.props.setHeaderInfo(
      'Manage Users',
    )
  }

  render () {
    if (!this.props.lab) {
      return null
    }

    return (
      <CompanyUsers lab={this.props.lab} currentCompany={this.props.currentCompany} />
    )
  }
}

const mapStateToProps = store => ({
  lab: currentLab(store),
  currentCompany: currentCompany(store),
})

const mapDispatchToProps = dispatch => ({
  setHeaderInfo: (title, buttons) => dispatch(setHeaderInfo(title, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TeamCompanyUsers)
