const WELL_MARKER_HEIGHT = 25
const WELL_MARKER_WIDTH = 100
import moment from 'moment'
import Immutable from 'immutable'
import { arrayPush, arrayRemove } from 'redux-form/immutable'

export const addZeroWell = (xpos, ypos, component, form) => {
  // debugger
  component.props.dispatch(arrayPush(
    form,
    'zeroWells',
    Immutable.Map({
      well_id: -1,
      xpos,
      ypos,
      substance_sum: 0,
    })
  ))
}

export const processClick = (xpos, ypos, siteMapWells, toggleWell, zeroWells, component, form) => {
  siteMapWells.forEach(siteMapWell => {
    if (Math.abs(siteMapWell.get('xpos') - xpos) <= WELL_MARKER_WIDTH/2 &&
        Math.abs(siteMapWell.get('ypos') - ypos) <= WELL_MARKER_HEIGHT/2) {
        toggleWell(siteMapWell.get('well_id'))
    }
  })

  if (!zeroWells) { return }

  zeroWells.forEach((zeroWell, index) => {
    if (Math.abs(zeroWell.get('xpos') - xpos) <= WELL_MARKER_WIDTH/2 &&
        Math.abs(zeroWell.get('ypos') - ypos) <= WELL_MARKER_HEIGHT/2) {
        component.props.dispatch(arrayRemove(form, 'zeroWells', index))
    }
  })
}

const compareDateToDateOrDateRange = (date, startDate, endDate)  => {
  if (!endDate) { return startDate.isSame(date) }
  if (endDate.isBefore(startDate)) { return false }
  return date.isBetween(startDate, endDate) || date.isSame(startDate) || date.isSame(endDate)
}

export const substanceIdInDate = (substanceId, sampleDates, t_date, t_date_end) => {

  if (!t_date) { return false; }
  const startDate = moment(t_date)
  const endDate = t_date_end ? moment(t_date_end) : null
  let isPresent = false

  return sampleDates.some((date) => {
    const d = moment(date.get('date_collected'))
    if (compareDateToDateOrDateRange(d, startDate, endDate) &&
        date.get('substance_ids').includes(substanceId)) {
      return true
    }
    return false
  })
}

export const startDateOptions = (dates, end_date) => {
  const filteredDates = end_date ?
    dates : dates.filter(date => moment(end_date).isAfter(moment(date.get('date_collected'))))
  return filteredDates.valueSeq().map((date, i) => <option key={date.get('id')}>{date.get('date_collected')}</option>)
}

export const endDateOptions = (dates, start_date) => {
  if (!start_date) { return [] }

  return dates.filter(date =>
    moment(start_date).isBefore(moment(date.get('date_collected')))
  )
  .valueSeq()
  .map((date, i) => <option key={date.get('id')}>{date.get('date_collected')}</option>)
}

export const selectedWellsForSubmit = (selectedWells, groupedSampleValues, zeroWells=Immutable.List()) => {
  const filteredWells = selectedWells.filter(selected => selected)
    .filter((selected, well_id) =>
      groupedSampleValues.get(well_id.toString()).get('xpos') &&
      groupedSampleValues.get(well_id.toString()).get('substance_sum')
    )

  return filteredWells.map((selected, well_id) => {
    const gsvWell = groupedSampleValues.get(well_id.toString())
    return {
      well_id: well_id,
      xpos: gsvWell.get('xpos'),
      ypos: gsvWell.get('ypos'),
      substance_sum: gsvWell.get('substance_sum'),
    }
  }).valueSeq().concat(zeroWells)
}

export const allWells = (siteMapWells, siteMapId, zeroWells=Immutable.List()) => {
  const filteredSiteMapWells = siteMapWells.filter((smw) =>
    smw.get('site_map_id') === parseInt(siteMapId)
  ).valueSeq()

  return filteredSiteMapWells.concat(zeroWells)
}

export const drawWellMarker = (well, ctx, loc, props, checkedImage, uncheckedImage, getValue) => {
  const { x, y, scale } = loc
  const { date, wells, groupedSampleValues, selectedWells } = props
  // const gsvWell = groupedSampleValues.get(well.get('well_id').toString())
  //
  // const val = groupedSampleValues.size ?
  //   (gsvWell ? gsvWell.get('substance_sum') : 0) :
  //   wells.getIn([well.get('well_id'), 'title'])
  let val = null
  if (well.get('well_id') === -1) {
    val = 0
  } else if (groupedSampleValues.size) {

    val = getValue(groupedSampleValues.get(well.get('well_id').toString()))

    // don't draw the well marker if no samples
    if (val === null) { return }
  } else {
    val = wells.getIn([well.get('well_id'), 'title'])
  }

  const color = 'black'
  const fontSize = 15 * scale
  const width = WELL_MARKER_WIDTH * scale
  const height = WELL_MARKER_HEIGHT * scale
  const checkboxSize = WELL_MARKER_HEIGHT * .8 * scale
  const checkboxImage = (well.get('well_id') === -1 || selectedWells.get(well.get('well_id'))) ?
    checkedImage : uncheckedImage

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

  ctx.closePath()

  ctx.beginPath()
  ctx.fillStyle = 'white'
  ctx.strokeStyle = 'white'
  ctx.arc(x - width*.45 + checkboxSize/2, y, checkboxSize/2 - 1, 0, 2*Math.PI)
  ctx.stroke()
  ctx.closePath()
  ctx.fill()

  ctx.drawImage(checkboxImage, x - width*.45, y - checkboxSize/2, checkboxSize, checkboxSize)

  ctx.closePath()
}
