
import React from 'react'
import { connect } from 'react-redux'


class CompanySettings extends React.Component {
    constructor (props) {
        super(props)
    }

    componentDidMount () {
    }

    render () {
        return (
            <div className="container-fluid">
                <p className="">Allow deletion of the company if there are no active users.</p>
            </div>
        )
    }
}

const mapStateToProps = store => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanySettings)
