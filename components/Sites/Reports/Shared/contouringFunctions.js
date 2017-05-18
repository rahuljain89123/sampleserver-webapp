const WELL_MARKER_HEIGHT = 25
const WELL_MARKER_WIDTH = 100
import moment from 'moment'


export const processClick = (xpos, ypos, siteMapWells, toggleWell) => {
  siteMapWells.forEach(siteMapWell => {
    if (Math.abs(siteMapWell.get('xpos') - xpos) <= WELL_MARKER_WIDTH/2 &&
        Math.abs(siteMapWell.get('ypos') - ypos) <= WELL_MARKER_HEIGHT/2) {
        toggleWell(siteMapWell.get('well_id'))
    }
  })
}

export const substanceIdInDate = (substanceId, t_date, sampleDates) => {

  if (!t_date) { return false; }
  const selectedDate = moment(t_date)

  let isPresent = false

  return sampleDates.some((date) => {
    const d = moment(date.get('date_collected'))
    if (d.isSame(selectedDate) &&
        date.get('substance_ids').includes(substanceId)) {
      return true
    }
    return false
  })
}

export const drawWellMarker = (well, ctx, loc, props, checkedImage, uncheckedImage) => {
  const { x, y, scale } = loc
  const { date, wells, groupedSampleValues, selectedWells } = props
  const gsvWell = groupedSampleValues.get(well.get('well_id').toString())

  const val = gsvWell ? gsvWell.get('substance_sum') : wells.getIn([well.get('well_id'), 'title'])
  const color = 'black'
  const fontSize = 15 * scale
  const width = WELL_MARKER_WIDTH * scale
  const height = WELL_MARKER_HEIGHT * scale
  const checkboxSize = WELL_MARKER_HEIGHT * .8 * scale
  const checkboxImage = selectedWells.get(well.get('well_id')) ? checkedImage : uncheckedImage
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
