import React from 'react'

const CANVAS_HEIGHT = '600'
const CANVAS_WIDTH = '800'

class SiteMapImage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      img: undefined,
      centerVals: {
        x: null,
        y: null,
      },
      x: 0,
      y: 0,
      scale: 1,
    }

    this.setImage = this.setImage.bind(this)
    this.drawCanvas = this.drawCanvas.bind(this)
    this.addSiteMapWell = this.addSiteMapWell.bind(this)

    this.componentDidUpdate = this.drawCanvas
  }

  componentDidMount () {
    const img = new Image()
    const setImage = this.setImage

    img.onload = function() {
      createImageBitmap(this).then(setImage)
    }
    img.src = this.props.imageUrl
  }

  /**
   * Takes a loaded img element and stores it into an ImageBitmap, and
   * updates the state with the appropriate x and y coordinate so that the image
   * is centered in the canvas element.
   */
  setImage(img) {
    this.setState({
      img,
      centerVals: {
        x: this.centerVal(img.width, CANVAS_WIDTH),
        y: this.centerVal(img.height, CANVAS_HEIGHT),
      },
      scale: 1,
    })
  }

  /**
   * @param imgDim {Integer} length of image
   * @param canvasDim {Integer} total length of canvas
   * @return the x or y coordinate such that the image will be centered within the canvas
   */
  centerVal (imgDim, canvasDim, scale = 1) {
    return (canvasDim - imgDim * scale) / 2;
  }

  addSiteMapWell (evt) {
    const divOffsets = evt.target.getBoundingClientRect()

    const x = (evt.clientX - divOffsets.left) - this.state.x
    const y = (evt.clientY - divOffsets.top)  - this.state.y

    this.props.addSiteMapWell(x, y)
  }

  scaleBy (increment) {
    if (this.state.scale < 0.3) { return } //don't decrement scale below 0
    this.setState((prevState) => {
      const newScale = prevState.scale + increment
      return {
        scale: newScale,
        centerVals: {
          x: this.centerVal(prevState.img.width, CANVAS_WIDTH, newScale),
          y: this.centerVal(prevState.img.height, CANVAS_HEIGHT, newScale),
        }
      }
    })
  }

  drawCanvas () {
    const ctx = this.canvasEl.getContext('2d')
    const { x, y, scale, img, centerVals: { x: centerX, y: centerY } } = this.state
    if (!img) { return } // break if the image hasn't been loaded yet.

    ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)

    ctx.drawImage(img, centerX + x, centerY + y, img.width * scale, img.height * scale)
    this.drawWells(ctx)
  }

  drawWells (ctx) {
    this.props.siteMapWells.forEach((well) => { this.drawWellMarker(well, ctx) })

    if (this.props.addingSiteMapWell) {
      this.drawWellMarker(this.props.addingSiteMapWell, ctx, 'white')
    }

  }

  drawWellMarker (well, ctx, color='black') {
    const { x: imgX, y: imgY, scale, centerVals: { x: centerX, y: centerY } } = this.state
    const x = well.get('xpos') * scale + (centerX + imgX),
          y = well.get('ypos') * scale + (centerY + imgY),
          r = 10

    // Draw top left of marker and fill it
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x - r, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x, y-r)
    ctx.arc(x, y, r, 3*Math.PI/2, Math.PI, true)
    ctx.stroke()
    ctx.closePath()
    ctx.fill()

    // Draw bottom right of marker and fill it
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x, y+r)
    ctx.arc(x, y, r, Math.PI/2, 0, true)
    ctx.stroke()
    ctx.closePath()
    ctx.fill()

    // Draw remainder of the circle
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI, false)
    ctx.stroke()

    ctx.closePath()
  }

  render () {
    const { addSiteMapWell, props: { imageUrl } } = this

    const overlayStyles = {
      width: `${CANVAS_WIDTH}px`,
      height: `${CANVAS_HEIGHT}px`,
    }

    return (
      <div>
        <a href='#' onClick={(e) => this.scaleBy(0.2)}>Zoom In</a>
        <a href='#' onClick={(e) => this.scaleBy(-0.2)}>Zoom Out</a>
        <div className='img-and-canvas-overlay' style={overlayStyles}>

          <canvas
            height={CANVAS_HEIGHT}
            width={CANVAS_WIDTH}
            ref={(canvas) => {this.canvasEl = canvas}}
            onClick={addSiteMapWell} />

        </div>
      </div>
    )
  }
}

export default SiteMapImage
