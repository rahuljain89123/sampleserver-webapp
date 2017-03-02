
import React from 'react'
import { connect } from 'react-redux'

import { Button } from '../basecoat/Button'
import {
    Select,
    Option,
} from '../basecoat/Form'

import { fetchCurrentUser, signout } from '../actions/users'
import { fetchLabs, setCurrentLabUrl } from '../actions/labs'

class Header extends React.Component {
    componentDidMount () {
        this.props.fetchCurrentUser()
        this.props.fetchLabs()
    }

    onChange (e) {
        this.setCurrentLabUrl(e.target.value)
    }

    onSignout () {
        this.props.signout()
        this.props.push('/')
    }

    render () {
        const labs = this.props.labs.entrySeq()

        return (
            <div className="columns clearfix" style={{ marginTop: 20, marginBottom: 20 }}>
                <div className="single-column">
                    <h3 className="float-left">SampleServe</h3>
                    { this.props.currentUser ? (
                        <Button
                            outline
                            className="float-right"
                            onClick={() => this.onSignout()}
                        >Sign Out</Button>
                    ) : (
                        <Button
                            outline
                            link
                            href="/signin"
                            className="float-right"
                        >Sign In</Button>
                    )}
                    <Select
                        name="lab_id"
                        className="float-right"
                        value={this.props.currentLabUrl}
                        onChange={e => this.onChange(e)}
                        style={{ marginRight: 15 }}
                    >
                        {labs.map(([id, item]) => (
                            <Option key={id} value={item.get('url')}>{item.get('title')}</Option>
                        ))}
                    </Select>
                </div>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    currentUser: store.get('currentUser'),
    currentLabUrl: store.get('currentLabUrl'),
    labs: store.get('labs').filter(lab => lab.get('title') !== ''),
})

const mapDispatchToProps = dispatch => ({
    fetchCurrentUser: () => dispatch(fetchCurrentUser()),
    fetchLabs: () => dispatch(fetchLabs()),
    signout: () => dispatch(signout()),
    setCurrentLabUrl: id => dispatch(setCurrentLabUrl(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
