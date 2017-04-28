import React from 'react'


class SiteMapImage extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.drawWells()
  }

  componentDidUpdate () {
    this.drawWells()
  }

  drawWells () {
    const ctx = this.canvasEl.getContext('2d')
    ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)

    this.props.siteMapWells.forEach((well) => { this.drawWell(well, ctx) })
  }

  drawWell (well, ctx) {
    const x = well.get('xpos'),
          y = well.get('ypos')

    ctx.beginPath()
    ctx.moveTo(x - 10, y - 10)
    ctx.lineTo(x + 10, y + 10)
    ctx.stroke();

    ctx.moveTo(x + 10, y - 10)
    ctx.lineTo(x - 10, y + 10)
    ctx.stroke()
    ctx.closePath()
  }

  render () {
    const { imageUrl, addSiteMapWell } = this.props
    return (
      <div className='img-and-canvas-overlay'>
        <img src={imageUrl} />

        <canvas
          height='640'
          width='640'
          ref={(canvas) => {this.canvasEl = canvas}}
          onClick={addSiteMapWell} />
      </div>
    )
  }
}

export default SiteMapImage
