import React from 'react'
import { connect } from 'react-redux'

import {
  fetchSubstances,
  fetchSubstanceGroups,
} from 'actions/substances'

class AnalyticalBoxmapsForm extends React.Component {
  componentDidMount () {
    this.props.fetchSubstances()
    this.props.fetchSubstanceGroups()
  }
  render () {
    // if (!this.props.substances) { return null }
    return (
      <div><ul>
        {this.props.substances.valueSeq().map((sub) => <li key={sub.get('id')}>{sub.get('title')}</li>)}
      </ul>
      hi
      <ul>
        {this.props.substanceGroups.valueSeq().map((sub) => <li key={sub.get('id')}>{sub.get('title')}</li>)}
      </ul></div>
    )
  }
}

const mapStateToProps = (state) => ({
  substances: state.get('substances'),
  substanceGroups: state.get('substanceGroups'),
})

const mapDispatchToProps = (dispatch) => ({
  fetchSubstances: () => dispatch(fetchSubstances()),
  fetchSubstanceGroups: () => dispatch(fetchSubstanceGroups()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticalBoxmapsForm)
