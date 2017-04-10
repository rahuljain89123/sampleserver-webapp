
import React from 'react'
import { connect } from 'react-redux'

import { editWell } from '../../actions/wells'

class WellRow extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            title: this.props.well.get('title'),
            top_of_casing: this.props.well.get('top_of_casing'),
            diameter: this.props.well.get('diameter'),
            material: this.props.well.get('material'),
            screenlength: this.props.well.get('screenlength'),
            sampletechnique: this.props.well.get('sampletechnique'),
            latitude: this.props.well.get('latitude'),
            longitude: this.props.well.get('longitude'),
            est_depth_to_water: this.props.well.get('est_depth_to_water'),
            depth_to_bottom: this.props.well.get('depth_to_bottom'),
            purge_water_disposal: this.props.well.get('purge_water_disposal'),
            notes: this.props.well.get('notes'),
        }
    }

    onChange (e) {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onBlur (e) {
        if (this.props.well.get(e.target.name) !== this.state[e.target.name]) {
            this.props.editWell(this.props.well.get('id'), {
                [e.target.name]: e.target.value,
            })
        }
    }

    render () {
        return (
            <tr>
                <td><input
                    onChange={e => this.onChange(e)}
                    onBlur={e => this.onBlur(e)}
                    name="title"
                    value={this.state.title}
                /></td>
                <td><input
                    onChange={e => this.onChange(e)}
                    onBlur={e => this.onBlur(e)}
                    name="top_of_casing"
                    value={this.state.top_of_casing}
                /></td>
                <td><input
                    onChange={e => this.onChange(e)}
                    onBlur={e => this.onBlur(e)}
                    name="diameter"
                    value={this.state.diameter}
                /></td>
                <td><input
                    onChange={e => this.onChange(e)}
                    onBlur={e => this.onBlur(e)}
                    name="material"
                    value={this.state.material}
                /></td>
                <td><input
                    onChange={e => this.onChange(e)}
                    onBlur={e => this.onBlur(e)}
                    name="screenlength"
                    value={this.state.screenlength}
                /></td>
                <td><input
                    onChange={e => this.onChange(e)}
                    onBlur={e => this.onBlur(e)}
                    name="sampletechnique"
                    value={this.state.sampletechnique}
                /></td>
                <td><input
                    onChange={e => this.onChange(e)}
                    onBlur={e => this.onBlur(e)}
                    name="latitude"
                    value={this.state.latitude}
                /></td>
                <td><input
                    onChange={e => this.onChange(e)}
                    onBlur={e => this.onBlur(e)}
                    name="longitude"
                    value={this.state.longitude}
                /></td>
                <td><input
                    onChange={e => this.onChange(e)}
                    onBlur={e => this.onBlur(e)}
                    name="est_depth_to_water"
                    value={this.state.est_depth_to_water}
                /></td>
                <td><input
                    onChange={e => this.onChange(e)}
                    onBlur={e => this.onBlur(e)}
                    name="depth_to_bottom"
                    value={this.state.depth_to_bottom}
                /></td>
                <td><input
                    onChange={e => this.onChange(e)}
                    onBlur={e => this.onBlur(e)}
                    name="purge_water_disposal"
                    value={this.state.purge_water_disposal}
                /></td>
                <td><input
                    onChange={e => this.onChange(e)}
                    onBlur={e => this.onBlur(e)}
                    name="notes"
                    value={this.state.notes}
                /></td>
            </tr>
        )
    }
}

const mapStateToProps = store => ({
    wells: store.get('wells'),
})

const mapDispatchToProps = dispatch => ({
    editWell: (id, well) => dispatch(editWell(id, well)),
})

export default connect(mapStateToProps, mapDispatchToProps)(WellRow)
