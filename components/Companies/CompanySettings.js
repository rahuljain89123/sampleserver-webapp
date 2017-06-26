
import React from 'react'
import { connect } from 'react-redux'
import {
  Button,
} from 'reactstrap'
import { fetchCompanies, deleteCompany } from '../../actions/companies'
import { flashMessage, setHeaderInfo } from 'actions/global'


class CompanySettings extends React.Component {
  componentDidMount () {
    this.props.setHeaderInfo(`${this.props.company.get('title')} / Settings`)
  }

  deleteClient () {
    this.props.deleteCompany(this.props.company.get('id'))
      .then(() => this.props.fetchCompanies())
      .then(() => {
        this.props.flashMessage('success', 'Client deleted.')
        this.props.push('/app')
      })
  }

  render () {
    return (
      <div className="container-fluid">
        <p className="">
          Since there are no active users, you may permanently delete this client.</p>
        <Button role="button" color="danger" onClick={() => this.deleteClient()}>
          Delete Client</Button>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  companies: store.get('companies'),
})

const mapDispatchToProps = dispatch => ({
  deleteCompany: id => dispatch(deleteCompany(id)),
  fetchCompanies: () => dispatch(fetchCompanies()),
  flashMessage: (type, message) => dispatch(flashMessage(type, message)),
  setHeaderInfo: (text, buttons) => dispatch(setHeaderInfo(text, buttons)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanySettings)
