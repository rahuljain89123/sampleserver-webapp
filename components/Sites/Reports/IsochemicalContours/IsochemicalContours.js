import React from 'react'
import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm, formValueSelector, change } from 'redux-form/immutable'
import { Form, Input, Label } from 'reactstrap'
import moment from 'moment'

import SelectFormGroup from 'SharedComponents/ReduxFormHelpers/SelectFormGroup'
import IndividualFormGroup from 'SharedComponents/ReduxFormHelpers/IndividualFormGroup'

import {
  fetchSiteMap,
  fetchSiteMaps,
  fetchSiteMapWells,
  createSiteMapWell,
  setAddingSiteMapWell,
  deleteSiteMapWell,
} from 'actions/siteMaps'

import {
  fetchWells
} from 'actions/wells'

import {
  fetchSubstances,
  fetchSubstanceGroups,
} from 'actions/substances'
import { fetchSamples } from 'actions/samples'
import { fetchGroupedSampleValues } from 'actions/sampleValues'

import {
  flashMessage
} from 'actions/global'

import IsochemicalContoursForm from './IsochemicalContoursForm'
import SiteMapRenderer from 'SharedComponents/SiteMapRenderer'

const SelectSubstances = ({ fields, options, substances }) => {

  const addSubstance = (e) => {
    fields.push(e.target.value)
  }

  return (
    <ul style={{listStyle: 'none'}}>
      <li> <Label>Substances</Label></li>
      {fields.map(
        (substance, index, fields) => {
          const remove = (e) => {
            e.preventDefault()
            fields.remove(index)
          }
          return (<li key={index}>
            {substances.get(parseInt(fields.get(index))).get('title')}{' '}
            <a href='#' onClick={remove}>X</a>
          </li>)
        }
      )}
      <li>
        <Input type='select' onChange={addSubstance}>
            {options}
        </Input>
      </li>
    </ul>
  )
}

class IsochemicalContours extends React.Component {
  constructor (props) {
    super(props)
    this.drawWellMarker = this.drawWellMarker.bind(this)
    this.processClickEvent = this.processClickEvent.bind(this)
  }

  componentDidMount () {
    this.props.fetchSiteMaps({ site_id: this.props.site.get('id') })
    this.props.fetchSubstances()
    this.props.fetchWells({ site_id: this.props.site.get('id') })
    this.props.fetchSamples({ site_id: this.props.site.get('id') })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.siteMapId && nextProps.siteMapId !== this.props.siteMapId) {
      this.props.fetchSiteMapWells({sitemap_id: nextProps.siteMapId })
    }

    if (nextProps.substanceIds
      && !nextProps.substanceIds.equals(this.props.substanceIds)
      && nextProps.siteMapId
      && nextProps.date) {
      this.props.fetchGroupedSampleValues({
        date: nextProps.date,
        sitemap_id: nextProps.siteMapId,
        substance_ids: nextProps.substanceIds,
        site_id: nextProps.site.get('id')
      })
    }
  }

  processClickEvent (xpos, ypos, evt) {
    console.log(evt.region)
  }

  drawWellMarker (well, ctx, loc) {
    const { x, y, scale } = loc

    const val = this.props.date ? 100.0 : this.props.wells.get(well.get('well_id')).get('title');
    const color = 'black'
    const fontSize = 15 * scale
    const width = 100 * scale
    const height = 25 * scale
    // const .
    ctx.fillStyle = color
    ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.fillRect(x-width/2, y-height/2, width, height)
    ctx.globalAlpha = 1.0

    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.textBaseline='middle'

    ctx.fillText(val, x, y)

    // ctx.addHitRegion({ id: well.get('id') })
    ctx.closePath()
  }

  render () {

    const siteMapOptions = this.props.siteMaps.valueSeq().map((siteMap) =>
      <option key={siteMap.get('id')} value={siteMap.get('id')}>{siteMap.get('title')}</option>
    )

    const dateOptions = this.props.dates.valueSeq().map((date, i) =>
      <option key={i}>{date.format('YYYY-MM-DD')}</option>)

    const substanceOptions = this.props.substances.valueSeq().map((substance) =>
      <option key={substance.get('id')} value={substance.get('id')}>{substance.get('title')}</option>
    )

    const booleanOptions = [
      { value: 'true', title: 'ON' },
      { value: 'false', title: 'OFF' }
    ].map((bool, index) => <option key={index} value={bool.value}>{bool.title}</option>)

    const scaleOptions = ['Linear', 'Logarithmic'].map((opt, index) =>
      <option key={index} value={opt}>{opt}</option>
    )

    let siteMapComponent = null

    if (this.props.siteMapId) {
      const currentSiteMap = this.props.siteMaps.get(
        parseInt(this.props.siteMapId)
      )


      const siteMapWells = this.props.siteMapWells.filter((smw) => smw.get('site_map_id') === parseInt(this.props.siteMapId))
      siteMapComponent = <SiteMapRenderer
        imageUrl={currentSiteMap.get('url')}
        wells={siteMapWells}
        onClick={this.processClickEvent}
        drawWellMarker={this.drawWellMarker}
        />
    }

    return (<div>
      <Form>
        <Field
          props={{label: 'Sitemap'}}
          name='sitemap_id'
          id='sitemap_id'
          component={SelectFormGroup}
          options={siteMapOptions}
        />

        <FieldArray
          name='substance_ids'
          id='substance_ids'
          component={SelectSubstances}
          options={substanceOptions}
          substances={this.props.substances}
        />

        <Field
          props={{label: 'Date'}}
          name='date'
          id='date'
          options={dateOptions}
          component={SelectFormGroup}
        />

        <Field
          props={{label: 'Zero Line'}}
          name='zero_line'
          id='zero_line'
          options={booleanOptions}
          component={SelectFormGroup}
        />

        <Field
          props={{label: 'Heatmap'}}
          name='heatmap'
          id='heatmap'
          options={booleanOptions}
          component={SelectFormGroup}
        />

        <Field
          props={{label: 'Scale'}}
          name='scale'
          id='scale'
          options={scaleOptions}
          component={SelectFormGroup}
        />

        <Field
          props={{label: 'Title'}}
          name='title'
          id='title'
          type='text'
          component={IndividualFormGroup}
        />
      </Form>

      {siteMapComponent}
    </div>)
  }
}

IsochemicalContours = reduxForm({ form: 'IsochemicalContoursForm' })(IsochemicalContours)

const selector = formValueSelector('IsochemicalContoursForm')

const mapStateToProps = (state, props) => ({
  siteMaps: state.get('siteMaps'),
  siteMapWells: state.get('siteMapWells'),
  substances: state.get('substances'),
  wells: state.get('wells'),
  samples: state.get('samples'),
  dates: state.get('samples')
    .valueSeq()
    .map((sample) => moment(sample.get('date_collected'))),
  groupedSampleValues: state.get('groupedSampleValues'),
  siteMapId: selector(state, 'sitemap_id'),
  substanceIds: selector(state, 'substance_ids'),
  date: selector(state, 'date'),
})

const mapDispatchToProps = dispatch => ({
  flashMessage: (type, message) => dispatch(flashMessage(type, heading)),

  fetchSiteMaps: (filters) => dispatch(fetchSiteMaps(filters)),
  fetchSiteMap: (id) => dispatch(fetchSiteMap(id)),
  fetchSamples: filters => dispatch(fetchSamples(filters)),
  fetchGroupedSampleValues: params => dispatch(fetchGroupedSampleValues(params)),
  fetchSiteMapWells: (filters) => dispatch(fetchSiteMapWells(filters)),
  fetchSubstances: (filters) => dispatch(fetchSubstances(filters)),

  fetchWells: (filters) => dispatch(fetchWells(filters)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IsochemicalContours)
